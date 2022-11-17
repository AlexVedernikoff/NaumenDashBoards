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

export {
	truncate
};
