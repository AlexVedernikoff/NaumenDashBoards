// @flow
import type {DTOValue, ExecErrorResponse} from 'api/types';
import {DISABLE_GET_METHOD, ERRORS, IS_USER_NEEDED_LIST} from './constants';
import {
	FilterAlreadyExists,
	FilterNameNotUnique,
	PersonalDashboardNotFound,
	RemoveFilterFailed,
	UndefinedError,
	WidgetNotFoundError
} from 'api/errors';

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

export const parseError = (response: ExecErrorResponse): Error => {
	try {
		const {exceptionType, message} = JSON.parse(response.responseText);

		switch (exceptionType) {
			case ERRORS.WIDGET_NOT_FOUND:
				return new WidgetNotFoundError(message);
			case ERRORS.PERSONAL_DASHBOARD_NOT_FOUND:
				return new PersonalDashboardNotFound(message);
			case ERRORS.FILTER_ALREADY_EXISTS:
				return new FilterAlreadyExists(message);
			case ERRORS.FILTER_NAME_NOT_UNIQUE:
				return new FilterNameNotUnique(message);
			case ERRORS.FILTER_MUST_NOT_BE_REMOVED:
			case ERRORS.REMOVE_FILTER_FAILED:
				return new RemoveFilterFailed(message);
			default:
				return new UndefinedError(message);
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('parseError: ', e);
		}

		throw response;
	}
};

export {
	buildRequestParams,
	calcMethod,
	isUserNeeded,
	parseParams
};
