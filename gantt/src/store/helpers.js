// @flow
import {store} from 'app.constants';

const isSourceType = (classFqn: string) => classFqn.includes('$');

/**
 * Возвращает подтипы источника
 * @param {string} classFqn - код источника
 * @returns {Array<string>}
 */
const getSourceTypes = (classFqn: string) => {
	const {sources} = store.getState();
	let types = sources[classFqn].children || [];

	if (types.length > 0) {
		const subTypes = types.map(getSourceTypes)
			.reduce((allSubTypes, subTypes) => [...allSubTypes, ...subTypes], []);

		types = [...types, ...subTypes];
	}

	return types;
};

/**
 * Возвращает массив для окна фильтрации, содержащий код источника и все его подтипы
 * @param {string} classFqn - код источника
 * @returns {Array<string>}
 */
const getDescriptorCases = (classFqn: string) => [classFqn, ...getSourceTypes(classFqn)];

const createFilterContext = (classFqn: string) => {
	const context: Object = {};

	if (isSourceType(classFqn)) {
		context.cases = getDescriptorCases(classFqn);
	} else {
		context.clazz = classFqn;
	}

	return context;
};

const getFilterContext = (descriptor: string, classFqn: string) => {
	let context = JSON.parse(descriptor);

	if (!context.clazz) {
		context = {
			...context,
			cases: getDescriptorCases(classFqn)
		};
	}

	return context;
};

export {
	createFilterContext,
	getFilterContext
};
