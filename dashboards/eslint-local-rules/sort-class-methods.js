const {createError, hasAlphabetOrderError, simplifyString} = require('./helpers');

const getMethodName = node => node.key.name;

const isRender = node => getMethodName(node).startsWith('render');

const sortWithSimplifyString = (str1, str2) => simplifyString(str1).localeCompare(simplifyString(str2));

const hasAlphabetMethodsOrderError = (method1, method2) => hasAlphabetOrderError(getMethodName(method1), getMethodName(method2));

const getMethodText = (sourceCode, methods) => name => {
	const method = methods.find(method => getMethodName(method) === name);
	return sourceCode.getText(method);
};

const sortArrowFunctionInClass = (sourceCode, methods) => fixer => {
	const names = methods.map(getMethodName);
	const helpersMethods = [];
	const renderMethods = [];

	if (names.length === (new Set(names)).size) { // Проверка на повторяющиеся методы
		names.forEach(name => (name.startsWith('render') ? renderMethods : helpersMethods).push(name));
		helpersMethods.sort(sortWithSimplifyString);
		renderMethods.sort(sortWithSimplifyString);

		const methodsText = [
			...helpersMethods.map(getMethodText(sourceCode, methods)),
			...renderMethods.map(getMethodText(sourceCode, methods))
		];

		if (methodsText.length === methods.length) {
			return methodsText.map((text, idx) => fixer.replaceText(methods[idx], text));
		}
	}

	return [];
};

const create = context => ({
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
});

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
