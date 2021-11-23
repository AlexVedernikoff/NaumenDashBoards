// @flow
import {createImage} from './core';
import {save} from './helpers';

/**
 * Создает снимок в pdf формате
 * @param {Array<HTMLCanvasElement>} images - canvas элемент готового изображения
 * @param {string} name - имя файла для сохранения
 * @param {boolean} toDownload - флаг вызова метода загрузки файла
 * @returns {Promise<Blob>}
 */
const createPdf = async (images: Array<HTMLCanvasElement>, name: string = '', toDownload: boolean = false) => {
	let orientation = 'p';

	if (images.length === 1) {
		const {height, width} = images[0];

		if (width > height) {
			orientation = 'l';
		}
	}

	const {default: JsPDF} = await import('jspdf');
	const pdf = new JsPDF({compress: true, orientation, unit: 'pt'});
	const pdfHeight = pdf.internal.pageSize.getHeight();
	const pdfWidth = pdf.internal.pageSize.getWidth();
	let pageOffset = 0;

	// eslint-disable-next-line no-unused-vars
	for (const image of images) {
		const {height, width} = image;
		let imageWidth = width < pdfWidth ? width : pdfWidth;
		let imageHeight = imageWidth / width * height;

		if (imageHeight > pdfHeight) {
			imageHeight = pdfHeight;
			imageWidth = imageHeight / height * width;
		}

		if (pageOffset + imageHeight > pdfHeight) {
			pdf.addPage();
			pageOffset = 0;
			pdf.setPage(pdf.getNumberOfPages());
		}

		pdf.addImage(image, 'PNG', 0, pageOffset, imageWidth, imageHeight);
		pageOffset = pageOffset + imageHeight;
	}

	const blob = pdf.output('blob');

	if (toDownload) {
		save(blob, name, 'pdf');
	}

	return blob;
};

/**
 * Создает pdf из div-элементов
 * @param {HTMLDivElement} containers - DOM элементы графиков с виджетами
 * @param {string} name - название файла для экспорта
 * @param {boolean} forSave - признак сохранения файла
 * @returns {Promise<Blob>}
 */
const exportPDF = async (containers: Array<HTMLDivElement>, name: string, forSave: boolean = false) => {
	const images = [];

	// eslint-disable-next-line no-unused-vars
	for (const container of containers) {
		const image = await createImage(container);

		images.push(image);
	}

	const pdfBlob = await createPdf(images, name, forSave);
	return pdfBlob;
};

export {
	exportPDF
};
