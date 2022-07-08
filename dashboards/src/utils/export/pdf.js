// @flow
import {createImage} from './core';
import type {CreatePdfImage, CreatePdfOptions, ExportPDFOptions, WidgetStoreItem} from './types';
import {DEFAULT_CREATE_PDF_OPTIONS, DEFAULT_EXPORT_PDF_OPTIONS, NEED_SCALE_WIDGET_TYPES} from './constants';
import {save} from './helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Создает снимок в pdf формате
 * @param {Array<HTMLCanvasElement>} data - canvas элемент готового изображения
 * @param {CreatePdfOptions} options - настройки создания Pdf
 * @returns {Promise<Blob>}
 */
const createPdf = async (data: Array<CreatePdfImage>, options: CreatePdfOptions) => {
	const {name, toDownload} = {...DEFAULT_CREATE_PDF_OPTIONS, ...options};
	let orientation = 'p';

	if (data.length === 1) {
		const {height, width} = data[0].image;

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
	for (const {image, scale} of data) {
		let {height, width} = image;

		if (scale !== 1) {
			height /= scale;
			width /= scale;
		}

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

const needScaleWidget = (type: $Keys<typeof WIDGET_TYPES>) => NEED_SCALE_WIDGET_TYPES.includes(type);

/**
 * Создает pdf из div-элементов
 * @param {Array<WidgetStoreItem>} containers - DOM элементы графиков с виджетами
 * @param {ExportPDFOptions} options - настройки экспорта
 * @returns {Promise<Blob>}
 */
const exportPDF = async (containers: Array<WidgetStoreItem>, options: ExportPDFOptions) => {
	const {name, toDownload} = {...DEFAULT_EXPORT_PDF_OPTIONS, ...options};
	const images = [];

	// eslint-disable-next-line no-unused-vars
	for (const container of containers) {
		const scale = needScaleWidget(container.type) ? 3 : 1;
		const image = await createImage(container.container, {scale});

		images.push({image, scale});
	}

	const pdfBlob = await createPdf(images, {name, toDownload});
	return pdfBlob;
};

export {
	exportPDF
};
