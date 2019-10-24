// @flow
import type {Context} from 'types/api';

const injectJsApi = () => top.injectJsApi(top, window);

/**
 * Получаем контекст встроенного приложения.
 * subjectUuid - кода объекта куда встроенно ВП.
 * contentCode - код самого ВП.
 * @returns {Context}
 */
const getContext = (): Context => {
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

const getParams = async () => {
	if (process.env.NODE_ENV === 'development') {
		return {
			colorStaticPoint: '#EB5757',
			colorDynamicActivePoint: '#4D92C8',
			colorDynamicInactivePoint: '#828282',
			timeIntervalInactivity: {length: 1200, interval: 'SECOND'}
		};
	}

	const {jsApi} = window;
	const params = await jsApi.commands.getCurrentContentParameters().then(data => data);

	return params;
};

export {
	getContext,
	getParams,
	injectJsApi
};
