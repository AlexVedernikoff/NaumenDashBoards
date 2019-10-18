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
			contentCode: 'Dashbord12',
			subjectUuid: 'root$101'
		};
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

	const parameters = await window.jsApi.commands.getCurrentContentParameters();
	return parameters && parameters.editable;
};

export {
	getContext,
	getEditableParameter
};
