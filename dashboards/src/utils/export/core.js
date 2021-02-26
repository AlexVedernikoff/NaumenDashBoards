// @flow
import Canvg from 'canvg';
import {FILE_VARIANTS} from './constants';
import html2canvas from 'html2canvas';
import {isLegacyBrowser, save} from './helpers';
import JsPDF from 'jspdf';
import type {Options} from './types';

window.html2canvas = html2canvas;

/*
	Браузеры типа IE и EDGE генерируют svg с невалидными, для работы html2canvas, атрибутами. Поэтому, для отображения графиков
	на итоговом изображении, используюется следующее обходное решение. Функция получает узлы графиков по селектору. Далее каждый узел
	сереализуется в строку и проходит фильтрацию на удаление всех невалидных атрибутов. По полученной строке создается
	png представление, которое подставляется на место svg-графика. После преобразования и замены всех графиков на png, создается
	общее изображение контейнера. После этого происходит удаление всех png представлений и возврат svg-графиков на место.
 */
const createIEImage = async (container: HTMLDivElement, options: Object) => {
	const charts = container.querySelectorAll('.apexcharts-svg, .speedometer');
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
				childToRemove: canvas,
				childToRestore: chart,
				parent: parentNode
			});

			parentNode.removeChild(chart);
			parentNode.appendChild(canvas);
		} catch (e) {
			console.error('ошибка canvg: ', e);
		}
	});

	const image = await html2canvas(container, options);

	temp.forEach(({childToRemove, childToRestore, parent}) => {
		parent.removeChild(childToRemove);
		parent.appendChild(childToRestore);
	});

	return image;
};

/**
 * Управляет отображением ненужных для экспорта элементов
 * @param {HTMLDivElement} container - элемент по которому создается изображение
 * @param {boolean} show - значение указывает о необходимости скрыть\показать элемент
 */
const handleShowUnnecessaryElements = (container: HTMLDivElement, show: boolean) => {
	const classNames = [
		'.apexcharts-toolbar',
		'.rc-menu',
		'.header-submenu',
		'.react-resizable-handle',
		'.apexcharts-tooltip',
		'.apexcharts-xaxistooltip',
		'.apexcharts-yaxistooltip'
	];
	const elements = container.querySelectorAll(classNames.join(', '));

	elements.forEach(toolbar => {
		toolbar.style.visibility = show ? 'visible' : 'hidden';
	});
};

/**
 * Создает canvas элемент снимка
 * @param {Options} options - параметры создаваемого файла
 * @returns {Promise<Blob>}
 */
const createImage = async (options: Options) => {
	const {container, fragment, type} = options;
	const backgroundColor = type === FILE_VARIANTS.PNG ? '#EFF3F8' : '#FFF';
	let config = {
		scrollY: 0
	};

	if (!fragment) {
		config = {
			...config,
			backgroundColor
		};
	}

	handleShowUnnecessaryElements(container, false);

	const image = isLegacyBrowser(false) ? await createIEImage(container, config) : await html2canvas(container, config);

	handleShowUnnecessaryElements(container, true);

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
		save(blob, name, 'pdf');
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

	if (isLegacyBrowser()) {
		// $FlowFixMe
		blob = image.msToBlob();
	} else {
		blob = await new Promise(resolve => image.toBlob(resolve));
	}

	if (toDownload) {
		save(blob, name, 'png');
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
	createSnapshot
};
