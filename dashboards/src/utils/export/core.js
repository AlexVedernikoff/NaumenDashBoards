// @flow
import Canvg from 'canvg';
import {FILE_VARIANTS} from './constants';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import type {Options} from './types';

/**
 * Функция создает имя файла
 * @returns {Promise<string>}
 */
const createName = async () => {
	const date = new Date();
	let name;

	try {
		const context = await window.jsApi.commands.getCurrentContextObject();
		name = context['card_caption'].replace(/(\|\||\|\|\|\|\*:|\*)/g, '');
	} catch (e) {
		name = 'Дашборд';
	}

	return `${name}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
};

window.html2canvas = html2canvas;
/**
 * Выгружает файл в браузер
 * @param {Blob} blob - файл
 * @param {string} filename - название файла
 */
const save = (blob: Blob, filename: string) => {
	let {body} = document;

	if (body) {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = filename;

		body.appendChild(link);
		link.click();
		body.removeChild(link);
	}
};

/**
 * Проверяет, является ли браузер IE или EDGE
 * @returns {boolean}
 */
const isIE = () => typeof document.documentMode === 'number' || /Edge/.test(navigator.userAgent);

/*
	Браузеры типа IE и EDGE генерируют svg с невалидными, для работы html2canvas, атрибутами. Поэтому, для отображения графиков
	на итоговом изображении, используюется следующее обходное решение. Функция получает узлы графиков по селектору. Далее каждый узел
	сереализуется в строку и проходит фильтрацию на удаление всех невалидных атрибутов. По полученной строке создается
	png представление, которое подставляется на место svg-графика. После преобразования и замены всех графиков на png, создается
	общее изображение контейнера. После этого происходит удаление всех png представлений и возврат svg-графиков на место.
 */
const createIEImage = async (container: HTMLDivElement, options: Object) => {
	const charts = container.querySelectorAll('.apexcharts-svg');
	const serializer = new XMLSerializer();
	const temp = [];

	[].forEach.call(charts, (chart) => {
		const parentNode = chart.parentNode;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		let v = null;

		let svg = serializer.serializeToString(chart);
		svg = svg.replace(/(xmlns="http:\/\/www.w3.org\/2000\/svg"|xmlns:NS\d+=""|NS\d+:xmlns:data="ApexChartsNS")/g, '');
		svg = svg.replace(/NS\d+:data:(innerTranslate[XY](="(.+?)")|(startAngle|angle|realIndex|strokeWidth|pathOrig|value|longestSeries)="(.+?)")/g, '');

		try {
			v = Canvg.fromString(ctx, svg);
			v.render();

			temp.push({
				parent: parentNode,
				childToRestore: chart,
				childToRemove: canvas
			});

			parentNode.removeChild(chart);
			parentNode.appendChild(canvas);
		} catch (e) {
			console.error('ошибка canvg: ', e);
		}
	});

	const image = await html2canvas(container, options);

	temp.forEach(({parent, childToRemove, childToRestore}) => {
		parent.removeChild(childToRemove);
		parent.appendChild(childToRestore);
	});

	return image;
};

/**
 * Создает canvas элемент снимка
 * @param {Options} options - параметры создаваемого файла
 * @returns {Promise<Blob>}
 */
const createImage = async (options: Options) => {
	const {container, fragment, type} = options;
	const backgroundColor = type === FILE_VARIANTS.PNG ? '#EFF3F8' : '#FFF';
	let config = {};

	if (!fragment) {
		const height = fragment || container.clientHeight > window.innerHeight ? container.clientHeight : window.innerHeight;
		config = {
			height,
			backgroundColor
		};
	}

	const image = isIE() ? await createIEImage(container, config) : await html2canvas(container, config);

	return image;
};

/**
 * Создает снимок в pdf формате
 * @param {HTMLCanvasElement} image - canvas элемент готового изображения
 * @param {Options} options - параметры создаваемого файла
 * @returns {Promise<Blob>}
 */
const createPdf = (image: HTMLCanvasElement, options: Options) => {
	const {name, toDownload} = options;
	const {height, width} = image;
	const orientation = width > height ? 'l' : 'p';
	const pdf = new JsPDF({compress: true, orientation, unit: 'pt'});

	const pdfHeight = pdf.internal.pageSize.getHeight();
	const pdfWidth = pdf.internal.pageSize.getWidth();
	const imageWidth = width < pdfWidth ? width : pdfWidth;
	let imageHeight = imageWidth / width * height;
	let countPage = 0;

	pdf.addImage(image, 'PNG', 0, 0, imageWidth, imageHeight);

	if (imageHeight > pdfHeight) {
		countPage = Math.floor(imageHeight / pdfHeight);
		let nextPageNumber = 1;

		while (countPage > 0) {
			const offset = pdfHeight * nextPageNumber;

			pdf.addPage();
			pdf.setPage(pdf.getNumberOfPages());
			pdf.addImage(image, 'PNG', 0, -offset, pdfWidth, imageHeight);

			nextPageNumber++;
			countPage--;
		}
	}

	const blob = pdf.output('blob');

	if (toDownload) {
		isIE() ? window.navigator.msSaveBlob(blob, `${name}.pdf`) : pdf.save(name);
	}

	return blob;
};

/**
 * Создает снимок в png формате
 * @param {HTMLCanvasElement} image - canvas элемент изображения
 * @param {Options} options - параметры создаваемого файла
 * @returns {Promise<Blob>}
 */
const createPng = async (image: HTMLCanvasElement, options) => {
	const {name, toDownload} = options;
	let blob;

	if (isIE()) {
		// $FlowFixMe
		blob = image.msToBlob();
	} else {
		blob = await new Promise(resolve => image.toBlob(resolve));
	}

	if (toDownload) {
		isIE() ? window.navigator.msSaveBlob(blob, `${name}.png`) : save(blob, name);
	}

	return blob;
};

/**
 * Создает снимок div-элемента
 * @param {Options} options - параметры создаваемого файла
 * @returns {Promise<Blob>}
 */
const createSnapshot = async (options: Options) => {
	const {type} = options;
	const {PDF, PNG} = FILE_VARIANTS;

	const image = await createImage(options);

	if (type === PNG) {
		return createPng(image, options);
	}

	if (type === PDF) {
		return createPdf(image, options);
	}
};

export {
	createName,
	createSnapshot
};
