// @flow
import {FILE_VARIANTS} from 'components/atoms/DropDownFiles/constansts.js';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import moment from 'moment';
import {RefContainer} from 'utils/refConatiner';

const savePdf = (fileName: string) => (documentPdf: Object): void => documentPdf.save(`${fileName}.pdf`);

export const createSnapshot = async (name: string, docStr: string) => {
  const container = new RefContainer().getRef();
  const fileName = `${name}_${moment().format('DD-MM-YY')}`;

  window.html2canvas = html2canvas;

  if (container && docStr === FILE_VARIANTS.PDF) {
    const doc = new JsPDF();

    doc.html(container, {
      callback: savePdf(fileName)
    });
  } else if (container && docStr === FILE_VARIANTS.PNG) {
    const img = (await html2canvas(container)).toDataURL();
    const element = document.createElement('a');

    element.setAttribute('href', img);
    element.setAttribute('download', `${fileName}.png`);
    element.style.display = 'none';
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  }
};
