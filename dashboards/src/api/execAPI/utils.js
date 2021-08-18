// @flow
import type {DTOValue} from 'api/types';
import {DISABLE_GET_METHOD, IS_USER_NEEDED_LIST} from './constants';

const isUserNeeded = (module: string, method: string) => {
	return IS_USER_NEEDED_LIST.some(({method: mth, module: md}) => module === md && method === mth);
};

const methodDisabledForGet = (module: string, method: string) => {
	return DISABLE_GET_METHOD.some(({method: mth, module: md}) => module === md && method === mth);
};

const parseParams = (module: string, method: string, names: Array<string>, values: Array<DTOValue>) => {
	let body;
	const params = [];

	names.forEach((name, idx) => {
		if (name === 'requestContent') {
			params.push(name);
			body = values[idx];
		} else {
			let value = values[idx];

			if (typeof value === 'string') {
				value = `'${value}'`;
			}

			params.push(encodeURIComponent(value));
		}
	});

	if (isUserNeeded(module, method)) {
		params.push('user');
	}

	return {body, queryString: params.join(',')};
};

const calcMethod = (module: string, method: string, paramNames: Array<string>) => {
	let result = {method: 'POST', type: 'exec-post'};

	if (method.startsWith('get') && !paramNames.includes('requestContent') && !methodDisabledForGet(module, method)) {
		result = {method: 'GET', type: 'exec'};
	}

	return result;
};

const buildRequestParams = (module: string, method: string, paramNames: Array<string>, params: Array<DTOValue>) => {
	const {method: httpMethod, type} = calcMethod(module, method, paramNames);
	const func = `modules.${module}.${method}`;
	const {body, queryString} = parseParams(module, method, paramNames, params);
	const url = `${type}?func=${func}&params=${queryString}`;
	return {body, httpMethod, url};
};

export {
	buildRequestParams,
	calcMethod,
	isUserNeeded,
	parseParams
};
