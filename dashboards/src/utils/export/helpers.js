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

	return `${name} (${moment().format('DD-MM-YYYY')})`;
};

/**
 * Выгружает файл в браузер
 * @param {Blob} blob - файл
 * @param {string} fileName - название файла
 * @param {string} extension - расширение файла
 */
const save = (blob: Blob, fileName: string, extension: string) => {
	const {body} = document;
	const name = `${fileName}.${extension}`;

	if (isLegacyBrowser()) {
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
 * Проверяет, использует ли браузер `Trident` или `EdgeHTML`
 * @param {boolean} includeEdge - включить в проверку `Edge`.
 * @returns {boolean} - возвращает `true`, если используется браузер `IE` или `Edge`.
 */
const isLegacyBrowser = (includeEdge: boolean = true) => {
	return typeof document.documentMode === 'number' || (includeEdge && /Edge/.test(navigator.userAgent));
};

const minimize = (string: string): string => string.replace(/\t|\r|\n|\v|\f/g, '');

export {
	createContextName,
	isLegacyBrowser,
	minimize,
	save
};
