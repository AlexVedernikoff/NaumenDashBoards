const {createError, hasAlphabetOrderError} = require('./helpers');

const isRender = node => node.key.name.startsWith('render');

const create = context => {
	return {
		ClassBody: function (node) {
			const methods = node.body.filter(node => node.value && node.value.type === 'ArrowFunctionExpression');

			try {
				// проверка порядка render-методов
				methods.forEach((node, index, methods) => {
					if (index < methods.length - 1 && isRender(node) && !isRender(methods[index + 1])) {
						throw createError(node, 'render-методы должны идти после вспомогательных методов');
					}
				});

				// алфавитный порядок вспомогательных методов
				methods.filter(node => !isRender(node)).forEach((node, index, methods) => {
					if (index < methods.length - 1 && hasAlphabetOrderError(node.key.name, methods[index + 1].key.name)) {
						throw createError(methods[index + 1], 'алфавитный порядок вспомогательных методов');
					}
				});

				// алфавитный порядок render-методов
				methods.filter(node => isRender(node)).forEach((node, index, methods) => {
					if (index < methods.length - 1 && hasAlphabetOrderError(node.key.name, methods[index + 1].key.name)) {
						throw createError(node, 'алфавитный порядок render-методов');
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
	}
};

module.exports = {
	create,
	meta
};
