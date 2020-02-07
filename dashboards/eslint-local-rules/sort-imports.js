const {createError, hasAlphabetOrderError} = require('./helpers');

const hasSpecifiers = node => node.specifiers.length > 0;

const getSortName = node => node.imported && typeof node.imported === 'object' ? node.imported.name : node.local.name;

const create = context => {
	return {
		Program: function (node) {
			const imports = node.body.filter(n => n.type === 'ImportDeclaration');

			try {
				// Проверка на порядок импортов без спецификаторов
				imports.forEach((node, index, imports) => {
					if (index > 0 && !hasSpecifiers(node) && hasSpecifiers(imports[index - 1])) {
						throw createError(node, 'импорты без спецификаторов должны быть в самом начале');
					}
				});

				// Проверка на алфавитный порядок импортов без спецификаторов
				imports.filter(node => !hasSpecifiers(node)).forEach((node, index, imports) => {
					if (index < node.length - 1 && hasAlphabetOrderError(node.source.value, imports[index + 1].source.value)) {
						throw createError(node, 'алфавитный порядок');
					}
				});

				// Проверка импортов с указанными спецификаторами
				imports.filter(hasSpecifiers).forEach((node, index, imports) => {
					const {specifiers} = node;

					// Проверка алфавитного порядка деструктурированных спецификаторов
					specifiers.filter(s => s.type !== 'ImportDefaultSpecifier').forEach((node, index, specifiers) => {
						if (index < specifiers.length - 1 && hasAlphabetOrderError(node.imported.name, specifiers[index + 1].imported.name)) {
							throw createError(node, 'алфавитный порядок');
						}
					});

					// Проверка алфавитного порядка импорта относительно следующей строки
					if (index < imports.length - 1 && hasAlphabetOrderError(getSortName(specifiers[0]), getSortName(imports[index + 1].specifiers[0]))) {
						throw createError(node, 'алфавитный порядок');
					}
				});
			} catch (error) {
				if (error.node && error.message) {
					return context.report(error);
				}
			}
		}
	};
};

const meta = {
	docs: {
		description: 'Отслеживает сортировку импортов'
	}
};

module.exports = {
	create,
	meta
};
