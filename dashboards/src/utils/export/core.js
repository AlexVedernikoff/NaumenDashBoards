// @flow
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

const createImage = async (container: HTMLDivElement, backgroundColor: string = '#FFF') => {
	const height = container.clientHeight < window.innerHeight ? window.innerHeight : container.clientHeight;
	const options = {
		height,
		backgroundColor
	};

	const image = await html2canvas(container, options);
	return image;
};

const createPdf = (image: string, fileName: string, container: HTMLDivElement) => {
	const orientation = container.clientWidth > container.clientHeight ? 'l' : 'p';
	const pdf = new JsPDF({compress: true, orientation, unit: 'pt'});

	if (orientation === 'p') {
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
	} else {
		pdf.addImage(image, 'PNG', 0, 0);
	}

	pdf.save(fileName);
};

export const createSnapshot = async (container: HTMLDivElement, name: string, variant: string) => {
	const {PDF, PNG} = FILE_VARIANTS;
	const fileName = `${name}_${moment().format('DD-MM-YY')}`;
	const bgColor = variant === PNG ? '#EFF3F8' : '#FFF';
	const content = editContentRef.current ? editContentRef.current : viewContentRef.current;
	content && content.scrollTo(0, 0);

	const image = await createImage(container, bgColor);

	if (variant === PNG) {
		if (image.msToBlob) {
			var blob = image.msToBlob();
			return window.navigator.msSaveBlob(blob, `${fileName}.png`);
		}

		return save(image.toDataURL('image/png'), fileName);
	}

	if (variant === PDF) {
		createPdf(image, fileName, container);
	}
};
