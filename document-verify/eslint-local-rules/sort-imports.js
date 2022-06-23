const {createError, hasAlphabetOrderError, simplifyString} = require('./helpers');

const getSortName = node => node.imported && typeof node.imported === 'object' ? node.imported.name : node.local.name;

const hasSpecifiers = node => node.specifiers.length > 0;

const compareNotSpecifiers = (impFirst, impSecond) => {
	const firstName = simplifyString(impFirst.source.value);
	const secondName = simplifyString(impSecond.source.value);
	return firstName.localeCompare(secondName);
};

const compareSpecifiers = (specsFirst, specsSecond) => {
	if (specsFirst.length === 0 && specsSecond.length === 0) {
		return 0;
	} else if (specsFirst.length === 0) {
		return -1;
	} else if (specsSecond.length === 0) {
		return 1;
	} else {
		const [specFirst, ...othersFirst] = specsFirst;
		const [specSecond, ...othersSecond] = specsSecond;
		const specFirstName = simplifyString(getSortName(specFirst));
		const specSecondName = simplifyString(getSortName(specSecond));
		const compare = specFirstName.localeCompare(specSecondName);

		return compare === 0 ? compareSpecifiers(othersFirst, othersSecond) : compare;
	}
};

const sortImportCompare = (importFist, importSecond) => {
	if (!hasSpecifiers(importFist) && !hasSpecifiers(importSecond)) {
		return compareNotSpecifiers(importFist, importSecond);
	} else if (hasSpecifiers(importFist) && !hasSpecifiers(importSecond)) {
		return 1;
	} else if (!hasSpecifiers(importFist) && hasSpecifiers(importSecond)) {
		return -1;
	} else {
		return compareSpecifiers(importFist.specifiers, importSecond.specifiers);
	}
};

const fixSortImports = (sourceCode, imports = []) => fixer => {
	const newImports = imports.sort(sortImportCompare);
	const newImportsTexts = newImports.map(imprt => sourceCode.getText(imprt)).join('\n');

	return [
		...imports.slice(1).map(imprt => fixer.remove(imprt)),
		fixer.replaceText(imports[0], newImportsTexts)
	];
};

const fixSortSpecifiers = (sourceCode, imprt) => fixer => {
	const otherSpecifiers = imprt.specifiers.filter(specifier => specifier.type !== 'ImportDefaultSpecifier');
	const textSpecifiers = otherSpecifiers.map(specifier => sourceCode.getText(specifier)).sort();
	return textSpecifiers.map((text, idx) => fixer.replaceText(otherSpecifiers[idx], text));
};

const create = context => {
	return {
		Program: function (program) {
			const sourceCode = context.getSourceCode();
			const imports = program.body.filter(n => n.type === 'ImportDeclaration');

			try {
				// Проверка на порядок импортов без спецификаторов
				imports.forEach((imprt, index, imports) => {
					if (index > 0 && !hasSpecifiers(imprt) && hasSpecifiers(imports[index - 1])) {
						throw createError(imprt, 'Импорты модулей для использования их побочных эффектов должны быть в самом начале', fixSortImports(sourceCode, imports));
					}
				});

				// Проверка на алфавитный порядок импортов без спецификаторов
				imports.filter(imprt => !hasSpecifiers(imprt)).forEach((imprt, index, imports) => {
					if (index < imprt.length - 1 && hasAlphabetOrderError(imprt.source.value, imports[index + 1].source.value)) {
						throw createError(imprt, 'Импорты модулей для использования их побочных эффектов должны быть отсортированы в алфавитном порядке', fixSortImports(sourceCode, imports));
					}
				});

				// Проверка импортов с указанными спецификаторами
				imports.filter(hasSpecifiers).forEach((imprt, index, imports) => {
					const {specifiers} = imprt;

					// Проверка алфавитного порядка деструктурированных спецификаторов
					specifiers.filter(s => s.type !== 'ImportDefaultSpecifier').forEach((specifier, index, specifiers) => {
						if (index < specifiers.length - 1 && hasAlphabetOrderError(specifier.imported.name, specifiers[index + 1].imported.name)) {
							throw createError(specifier, 'Импортируемых значений внутри импорта должен быть в алфавитном порядке ', fixSortSpecifiers(sourceCode, imprt));
						}
					});

					// Проверка алфавитного порядка импорта относительно следующей строки
					if (index < imports.length - 1 && hasAlphabetOrderError(getSortName(specifiers[0]), getSortName(imports[index + 1].specifiers[0]))) {
						throw createError(imprt, 'Болк импортов должен быть отсортирован в алфавитном порядке', fixSortImports(sourceCode, imports));
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
	},
	fixable: 'code'
};

module.exports = {
	create,
	meta
};
