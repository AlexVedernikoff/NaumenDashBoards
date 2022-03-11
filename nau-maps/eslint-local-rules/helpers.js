/**
 * Создание объекта ошибки
 * @param node {string} - название метода
 * @param message {string} - описание ошибки
 * @param fix {string} - указатель места устранения
 * @returns {object}
 */
const createError = (node, message, fix = null) => ({
	fix,
	message,
	node
});

/**
 * Проверка строки на соответствие CamelCase регистру
 * @param str {string} - строка для проверки
 * @returns {boolean}
 */
const hasCamelCase = str => /([a-z]*)([A-Z]*?)([A-Z][a-z]+)/g.test(str);

/**
 * Преобразование строки в SnakeCase
 *
 * @param str {string} - строка для преобразования
 * @returns {string}
 */
const toSnakeCase = str => {
	const upperChars = str.match(/([A-Z])/g);

	upperChars.forEach(char => {
		str = str.replace(new RegExp(char), '_' + char.toLowerCase());
	});

	if (str[0] === '_') {
		str = str.slice(1);
	}

	return str;
};

/**
 * Преобразование строки из CamelCase в SnakeCase
 *
 * @param str {string} - строка на преобразование
 * @returns {string}
 */
const camelCaseToSnakeCase = str => {
	if (hasCamelCase(str)) {
		str = toSnakeCase(str);
	}

	return str.toLowerCase();
};

/**
 * Проверка на сортировку по алфавиту
 * @param currentString {string} - текущее название
 * @param nextString {string} - следующее название
 * @returns {boolean}
 */
const hasAlphabetOrderError = (currentString, nextString) => camelCaseToSnakeCase(currentString) > camelCaseToSnakeCase(nextString);

module.exports = {
	camelCaseToSnakeCase,
	createError,
	hasAlphabetOrderError
};
