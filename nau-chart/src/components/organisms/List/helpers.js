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
 * @param callback {function} функция для вызова
 * @param timeout {number} врямя задежки, по умолчанию 500
 * @returns {function} - функция после задержки
 * */
const debounce = <A>(callback: (value: A) => void, timeout: number = 500) => {
	let timer = null;

	return (value: A) => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			callback(value);
		}, timeout);
	};
};

/**
 * Унификация строки для поиска, очистка от пробелов и преобразованние в нижний регистр
 * @param string {string} - входная строка
 * @returns {string} - результирующая строка
 */
const stringUnification = (string: string) => string.toLowerCase().replace(/\s/g, '');

export {
	stringUnification,
	debounce,
	truncate
};
