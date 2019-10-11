// @flow
import {FILE_VARIANTS} from './constants';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import moment from 'moment';

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

const createImage = async (container: HTMLDivElement) => {
	const height = container.clientHeight < window.innerHeight ? window.innerHeight : container.clientHeight;
	const options = {
		height,
		backgroundColor: '#EFF3F8'
	};

	return (await html2canvas(container, options)).toDataURL('image/png');
};

const createPdf = (image: string, fileName: string) => {
	const pdf = new JsPDF({orientation: 'l'});
	const width = pdf.internal.pageSize.getWidth();
	const height = pdf.internal.pageSize.getHeight();

	pdf.addImage(image, 'PNG', 0, 0, width, height);
	pdf.save(fileName);
};

export const createSnapshot = async (container: HTMLDivElement, name: string, variant: string) => {
	const fileName = `${name}_${moment().format('DD-MM-YY')}`;
	const {PDF, PNG} = FILE_VARIANTS;
	const image = await createImage(container);

	if (variant === PNG) {
		return save(image, fileName);
	}

	if (variant === PDF) {
		createPdf(image, fileName);
	}
};
