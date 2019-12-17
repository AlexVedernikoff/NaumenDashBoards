// @flow
import type {Context} from './types';

/**
 * Получаем контекст встроенного приложения.
 * subjectUuid - кода объекта куда встроенно ВП.
 * contentCode - код самого ВП.
 * @returns {Context}
 */
const getContext = () => {
	if (process.env.NODE_ENV === 'development') {
		return {
			contentCode: 'TestZhdanova',
			subjectUuid: 'employee$2384002'
		};
	}

	const {jsApi} = window;

	return {
		contentCode: jsApi.findContentCode(),
		subjectUuid: jsApi.extractSubjectUuid()
	};
};

const getContentParameters = async () => {
	if (process.env.NODE_ENV === 'development') {
		return {
			editable: true,
			autoUpdateInterval: 15
		};
	}

	const parameters = await window.jsApi.commands.getCurrentContentParameters();
	return parameters;
};

export {
	getContentParameters,
	getContext
};
