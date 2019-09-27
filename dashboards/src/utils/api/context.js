// @flow
const initApi = () => top.injectJsApi(top, window);

const getContext = () => {
	if (process.env.NODE_ENV === 'development') {
		return {
			contentCode: 'Dashbord12',
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

export {
	getContext
};
