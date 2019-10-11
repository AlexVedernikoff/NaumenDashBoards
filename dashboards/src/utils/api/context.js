// @flow
import type {Context} from './types';

const initApi = () => top.injectJsApi(top, window);

/**
 * Получаем контекст встроенного приложения.
 * subjectUuid - кода объекта куда встроенно ВП.
 * contentCode - код самого ВП.
 * @returns {Context}
 */
const getContext = () => {
	if (process.env.NODE_ENV === 'development') {
		return {
			contentCode: 'Dashbord1',
			subjectUuid: 'root$101'
		};
	}

	if (!('jsApi' in window)) {
		initApi();
	}

	const {jsApi} = window;

	return {
		contentCode: jsApi.findContentCode(),
		subjectUuid: jsApi.extractSubjectUuid()
	};
};

const getEditableParameter = async () => {
	if (process.env.NODE_ENV === 'development') {
		return true;
	}

	if (!('jsApi' in window)) {
		initApi();
	}

	return (await window.jsApi.getCurrentContentParameters()).editable;
};

export {
	getContext,
	getEditableParameter
};
