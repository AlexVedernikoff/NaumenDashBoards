// @flow
import canvg from 'canvg';
import {editContentRef} from 'components/pages/DashboardEditContent';
import {FILE_VARIANTS} from './constants';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import {viewContentRef} from 'components/pages/DashboardViewContent';

window.html2canvas = html2canvas;

/**
 * Выгружает файл в браузер
 * @param {string} uri - путь к файлу
 * @param {string} filename - название файла
 */
const save = (uri: string, filename: string) => {
	let {body} = document;

	if (body) {
		const link = document.createElement('a');
		link.href = uri;
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

		let svg = serializer.serializeToString(chart);
		svg = svg.replace(/(xmlns="http:\/\/www.w3.org\/2000\/svg"|xmlns:NS\d+=""|NS\d+:xmlns:data="ApexChartsNS")/g, '');
		svg = svg.replace(/NS\d+:data:(innerTranslate[XY](="(.+?)")?|(startAngle|angle|strokeWidth|realIndex|pathOrig|value|longestSeries)="(.+?)")/g, '');

		// TODO нужно для отлова ошибок на комбо-графиках
		try {
			canvg(canvas, svg);
		} catch (e) {
			console.error(e);
		}

		temp.push({
			parent: parentNode,
			childToRestore: chart,
			childToRemove: canvas
		});

		parentNode.removeChild(chart);
		parentNode.appendChild(canvas);
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
 * @param {HTMLDivElement} container - узел в dom-дереве, относительно которого будет создаваться снимок
 * @param {string} backgroundColor - цвет фона
 * @returns {Promise<Blob>}
 */
const createImage = async (container: HTMLDivElement, backgroundColor: string) => {
	const height = container.clientHeight < window.innerHeight ? window.innerHeight : container.clientHeight;
	const options = {
		height,
		backgroundColor
	};

	const image = isIE() ? await createIEImage(container, options) : await html2canvas(container, options);
	return image;
};

/**
 * Создает снимок в pdf формате
 * @param {HTMLCanvasElement} image - canvas элемент готового изображения
 * @param {string} fileName - название файла
 * @param {HTMLDivElement} container - узел в dom-дереве, относительно которого будет создаваться pdf документ
 * @param {boolean} toDownload - нужно ли выгружать в браузер
 * @returns {Promise<Blob>}
 */
const createPdf = (image: string, fileName: string, container: HTMLDivElement, toDownload: boolean) => {
	const orientation = container.clientWidth > container.clientHeight ? 'l' : 'p';
	const pdf = new JsPDF({compress: true, orientation, unit: 'pt'});

	const pdfHeight = pdf.internal.pageSize.getHeight();
	const pdfWidth = pdf.internal.pageSize.getWidth();
	const imageHeight = container.clientHeight / container.clientWidth * pdfWidth;
	let countPage = 0;

	pdf.addImage(image, 'PNG', 0, 0, pdfWidth, imageHeight);

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
		isIE() ? window.navigator.msSaveBlob(blob, `${fileName}.pdf`) : pdf.save(fileName);
	}

	return blob;
};

/**
 * Создает снимок в png формате
 * @param {HTMLCanvasElement} image - canvas элемент изображения
 * @param {string} fileName - название файла
 * @param {boolean} toDownload - нужно ли выгружать в браузер
 * @returns {Promise<Blob>}
 */
const createPng = async (image: HTMLCanvasElement, fileName: string, toDownload: boolean) => {
	let blob;

	if (isIE()) {
		// $FlowFixMe
		blob = image.msToBlob();
	} else {
		blob = await new Promise(resolve => image.toBlob(resolve));
	}

	if (toDownload) {
		isIE() ? window.navigator.msSaveBlob(blob, `${fileName}.png`) : save(image.toDataURL('image/png'), fileName);
	}

	return blob;
};

/**
 * Создает снимок div-элемента
 * @param {HTMLDivElement} container - узел в dom-дереве, относительно которого будет создаваться снимок
 * @param {string} fileType - формат итогового файла
 * @param {boolean} toDownload - нужно ли выгружать в браузер
 * @param {string} name - название файла
 * @returns {Promise<Blob>}
 */
export const createSnapshot = async (container: HTMLDivElement, fileType: string, toDownload: boolean, name: string) => {
	const {PDF, PNG} = FILE_VARIANTS;
	const bgColor = fileType === PNG ? '#EFF3F8' : '#FFF';
	const content = editContentRef.current ? editContentRef.current : viewContentRef.current;
	content && content.scrollTo(0, 0);

	const image = await createImage(container, bgColor);

	if (fileType === PNG) {
		return createPng(image, name, toDownload);
	}

	if (fileType === PDF) {
		return createPdf(image, name, container, toDownload);
	}
};
