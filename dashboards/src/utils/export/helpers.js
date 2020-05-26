// @flow
import moment from 'moment';

/**
 * Cоздает имя файла
 * @returns {Promise<string>}
 */
const createContextName = async () => {
	let name;

	try {
		const context = await window.jsApi.commands.getCurrentContextObject();
		name = context['card_caption'].replace(/(\|\||\|\|\|\|\*:|\*)/g, '');
	} catch (e) {
		name = 'Дашборд';
	}

	return `${name}(${moment().format('DD-MM-YYYY')})`;
};

/**
 * Выгружает файл в браузер
 * @param {Blob} blob - файл
 * @param {string} subName - название файла
 * @param {string} extension - расширение файла
 */
const save = async (blob: Blob, subName: string, extension: string) => {
	const {body} = document;
	const contextName = await createContextName();
	const name = subName ? `${subName}_${contextName}.${extension}` : `${contextName}.${extension}`;

	if (isIE()) {
		window.navigator.msSaveBlob(blob, name);
	} else if (body) {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = name;

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

const minimize = (string: string): string => string.replace(/\t|\r|\n|\v|\f/g, '');

export {
	isIE,
	minimize,
	save
};
