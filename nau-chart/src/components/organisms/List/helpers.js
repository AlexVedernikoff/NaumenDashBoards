// @flow
/**
 * Обрезка строки по заданному кол-ву символов
 * @param str {string} строка
 * @param n {number} кол-во символов
 * @returns {string} - результирующая обрезанная строка
 * */
const truncate = (str: string, n: number) => {
	return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

/**
 * Вызов функции не чаще чем на заддоное кол-во времени
 * @param {Function} callback  функция для вызова
 * @param {number} wait врямя задежки, по умолчанию 500
 * @returns {Function} - функция после задержки
 * */
const debounce = <A>(callback: (value: A) => void, wait: number = 1000) => {
	let timeout;
	return (value: A) => {
		clearTimeout(timeout);

		const later = () => {
			timeout = null;

			callback(value);
		};

		timeout = setTimeout(later, wait);
	};
};

/**
 * Унификация строки для поиска, очистка от пробелов и преобразованние в нижний регистр
 * @param string {string} - входная строка
 * @returns {string} - результирующая строка
 */
const stringUnification = (string: string) => string.toLowerCase().replace(/^\s|\s$/g, '');

export {
	stringUnification,
	debounce,
	truncate
};
