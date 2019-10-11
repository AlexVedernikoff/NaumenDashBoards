// @flow
import {FILE_VARIANTS} from 'components/atoms/DropDownFiles/constansts.js';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import moment from 'moment';
import {RefContainer} from 'utils/refConatiner';
 
window.html2canvas = html2canvas;

export const createSnapshot = async (name: string, docStr: string) => {
	const A4 = [1240, 1754]; // ppi: [1240, 1754],[595, 842], [794, 1123]
	const clone = new RefContainer().getRef();
	const container = clone.cloneNode(true);
	const fileName = `${name}_${moment().format('DD-MM-YY')}`;
	const options = {
		format: A4,
		orientation: 'l',
		unit: 'px'
	};
	const parrent = container.childNodes[0];
	const parrentChild = [...parrent.childNodes];

	// сброс стилей
	parrent.style.background = '#EFF3F8';
	parrent.style.display = 'flex';
	parrent.style.flexWrap = 'wrap';

	// сброс стилей
	parrentChild.forEach(child => {
		child.style.background = 'white !important';
		child.style.boxShadow = null;
		child.style.position = 'relative';
		child.style.transform = null;
	});

	if (container && docStr === FILE_VARIANTS.PDF) {
		const pdf = new JsPDF(options);
		let heigthPage: number = 0;
		let maxHeight: number = 0;
		let positionX: number = 0;
		let positionY: number = 0;

		for await (const img of parrentChild) {
			window.document.body.append(img);

			const imgItem = (await html2canvas(img)).toDataURL('image/jpg');
			const x = parseInt(img.style.width) / Math.sqrt(Math.PI);
			const y = parseInt(img.style.height) / Math.sqrt(Math.PI);
			maxHeight = maxHeight > y ? maxHeight : y;

			if (positionX + parseInt(img.style.width) >= A4[0]) {
				positionX = 0;
				positionY += maxHeight;
				maxHeight = 0;
			}

			pdf.addImage(imgItem, 'JPG', positionX, positionY);
			positionX += x;
			heigthPage += y;

			if (heigthPage >= A4[1]) {
				pdf.addPage();
				heigthPage = 0;
			}
			window.document.body.removeChild(img);
		}
		pdf.save(fileName);
	} else if (container && docStr === FILE_VARIANTS.PNG) {
		window.document.body.appendChild(container);

		const img = (await html2canvas(container)).toDataURL('image/png');
		const element = document.createElement('a');

		element.setAttribute('href', img);
		element.setAttribute('download', `${fileName}.png`);
		element.style.display = 'none';
		window.document.body.appendChild(element);
		element.click();
		window.document.body.removeChild(element);
		window.document.body.removeChild(container);
	}
};
