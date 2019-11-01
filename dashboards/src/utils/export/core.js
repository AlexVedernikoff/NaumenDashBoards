// @flow
import canvg from 'canvg';
import {editContentRef} from 'components/pages/DashboardEditContent';
import {FILE_VARIANTS} from './constants';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import moment from 'moment';
import {viewContentRef} from 'components/pages/DashboardViewContent';

window.html2canvas = html2canvas;

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

		canvg(canvas, svg);
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

const createImage = async (container: HTMLDivElement, backgroundColor: string, isIE: boolean) => {
	const height = container.clientHeight < window.innerHeight ? window.innerHeight : container.clientHeight;
	const options = {
		height,
		backgroundColor
	};

	const image = isIE ? await createIEImage(container, options) : await html2canvas(container, options);
	return image;
};

const createPdf = (image: string, fileName: string, container: HTMLDivElement, isIE: boolean) => {
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

	if (isIE) {
		const blob = pdf.output('blob');
		return window.navigator.msSaveBlob(blob, `${fileName}.pdf`);
	}

	pdf.save(fileName);
};

const createPng = (image: string, fileName: string, isIE: boolean) => {
	if (isIE) {
		const blob = image.msToBlob();
		return window.navigator.msSaveBlob(blob, `${fileName}.png`);
	}

	return save(image.toDataURL('image/png'), fileName);
};

export const createSnapshot = async (container: HTMLDivElement, name: string, variant: string) => {
	const {PDF, PNG} = FILE_VARIANTS;
	const fileName = `${name}_${moment().format('DD-MM-YY')}`;
	const bgColor = variant === PNG ? '#EFF3F8' : '#FFF';
	const content = editContentRef.current ? editContentRef.current : viewContentRef.current;
	const isIE = document.documentMode || /Edge/.test(navigator.userAgent);
	content && content.scrollTo(0, 0);

	const image = await createImage(container, bgColor, isIE);

	if (variant === PNG) {
		return createPng(image, fileName, isIE);
	}

	if (variant === PDF) {
		createPdf(image, fileName, container, isIE);
	}
};
