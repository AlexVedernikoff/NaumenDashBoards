// @flow
import {isLegacyBrowser, save} from './helpers';

/**
 * Браузеры типа IE и EDGE генерируют svg с невалидными, для работы html2canvas, атрибутами. Поэтому, для отображения графиков
 * на итоговом изображении, используются следующее обходное решение. Функция получает узлы графиков по селектору.
 * Далее каждый узел сериализуется в строку и проходит фильтрацию на удаление всех невалидных атрибутов.
 * По полученной строке создается png представление, которое подставляется на место svg-графика.
 * После преобразования и замены всех графиков на png, создается общее изображение контейнера.
 * После этого происходит удаление всех png представлений и возврат svg-графиков на место.
 * @param {HTMLDivElement} container - элемент-контейнер
 * @param {object} options - опции для html2canvas
 * @returns {object} - картинка
 */
const createIEImage = async (container: HTMLDivElement, options: Object) => {
	const Canvg = await import('canvg');
	const {default: html2canvas} = await import('html2canvas');
	const charts = container.querySelectorAll('.apexcharts-svg, .speedometer');
	const serializer = new XMLSerializer();
	const temp = [];

	[].forEach.call(charts, chart => {
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
			console.error('Canvg error: ', e);
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
 * @param {HTMLDivElement} container - DOM элемент с графиком виджета
 * @param {boolean} addBackgroundColor - признак добавления подложки
 * @param {string} backgroundColor - цвет подложки
 * @returns {Promise<Blob>}
 */
const createImage = async (container: HTMLDivElement, addBackgroundColor: boolean = true, backgroundColor: string = '#FFF') => {
	const {default: html2canvas} = await import('html2canvas');
	let config = {
		scrollY: 0
	};

	if (addBackgroundColor) {
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
 * Создает снимок в png формате
 * @param {HTMLCanvasElement} image - canvas элемент изображения
 * @param {string} name - название файла для экспорта
 * @param {boolean} toDownload - признак сохранения файла
 * @returns {Promise<Blob>}
 */
const createPng = async (image: HTMLCanvasElement, name: string = '', toDownload: boolean = false) => {
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
 * @param {HTMLDivElement} container - DOM элемент с графиком виджета
 * @param {boolean} addBackground - признак добавления подложки
 * @param {string} name - название файла для экспорта
 * @param {boolean} toDownload - признак сохранения файла
 * @returns {Promise<Blob>}
 */
const exportPNG = async (container: HTMLDivElement, addBackground: boolean = true, name: string = '', toDownload: boolean = false) => {
	const image = await createImage(container, addBackground, '#EFF3F8');
	return createPng(image, name, true);
};

export {
	createImage,
	exportPNG
};
