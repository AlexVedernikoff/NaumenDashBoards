const {camelCaseToSnakeCase, createError, hasAlphabetOrderError} = require('./helpers');

/**
 * Возвращает название метода
 * @param node {object} - объект метода
 * @returns {string}
 */
const getMethodName = node => node.key.name;

/**
 * Начинается ли название с рендера
 * @param node {object} - объект метода
 * @returns {boolean}
 */
const isRender = node => getMethodName(node).startsWith('render');

/**
 * Сравнивает строки с приведением их к snake_case
 * @param str1 {string} - текущее название
 * @param str2 {string} - следующее название
 * @returns {number}
 */
const compareWithConversionToSnakeCase = (str1, str2) => camelCaseToSnakeCase(str1).localeCompare(camelCaseToSnakeCase(str2));

/**
 * Проверка на сортировку методов по алфавиту
 * @param method1 {string} - текущий метод
 * @param method2 {string} - следующий метод
 * @returns {boolean}
 */
const hasAlphabetMethodsOrderError = (method1, method2) => hasAlphabetOrderError(getMethodName(method1), getMethodName(method2));

/**
 * Возвращает метод в виде строки
 * @param sourceCode {string} - код
 * @param methods {array} - методы
 * @returns {string}
 */
const getMethodText = (sourceCode, methods) => name => {
	const method = methods.find(method => getMethodName(method) === name);
	return sourceCode.getText(method);
};

/**
 * Сортировка методов в классе
 * @param sourceCode {string} - исходный код
 * @param methods {Array} - методы
 * @returns {Array<string>}
 */
const sortArrowFunctionInClass = (sourceCode, methods) => fixer => {
	const names = methods.map(getMethodName);
	const helperMethods = [];
	const renderMethods = [];

	if (names.length === (new Set(names)).size) { // Проверка на повторяющиеся методы
		names.forEach(name => (name.startsWith('render') ? renderMethods : helperMethods).push(name));
		helperMethods.sort(compareWithConversionToSnakeCase);
		renderMethods.sort(compareWithConversionToSnakeCase);

		const methodsText = [
			...helperMethods.map(getMethodText(sourceCode, methods)),
			...renderMethods.map(getMethodText(sourceCode, methods))
		];

		if (methodsText.length === methods.length) {
			return methodsText.map((text, idx) => fixer.replaceText(methods[idx], text));
		}
	}

	return [];
};

const create = context => {
	return {
		ClassBody: function (node) {
			const sourceCode = context.getSourceCode();
			const methods = node.body.filter(node => node.value && node.value.type === 'ArrowFunctionExpression');

			try {
				// проверка порядка render-методов
				methods.forEach((method, index, methods) => {
					if (index < methods.length - 1 && isRender(method) && !isRender(methods[index + 1])) {
						throw createError(
							method,
							'Render-методы должны идти после вспомогательных методов',
							sortArrowFunctionInClass(sourceCode, methods)
						);
					}
				});

				// алфавитный порядок вспомогательных методов
				methods.filter(method => !isRender(method)).forEach((method, index, methods) => {
					if (index < methods.length - 1 && hasAlphabetMethodsOrderError(method, methods[index + 1])) {
						throw createError(
							methods[index + 1],
							'Вспомогательные методы должны идти в алфавитном порядке',
							sortArrowFunctionInClass(sourceCode, methods)
						);
					}
				});

				// алфавитный порядок render-методов
				methods.filter(method => isRender(method)).forEach((method, index, methods) => {
					if (index < methods.length - 1 && hasAlphabetMethodsOrderError(method, methods[index + 1])) {
						throw createError(
							methods[index + 1],
							'Render-методы должны идти в алфавитном порядке',
							sortArrowFunctionInClass(sourceCode, methods)
						);
					}
				});
			} catch (error) {
				context.report(error);
			}
		}
	};
};

const meta = {
	docs: {
		description: 'Отслеживает сортировку методов в классе'
	},
	fixable: 'code'
};

module.exports = {
	create,
	meta
};
