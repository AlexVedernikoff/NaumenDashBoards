// @flow
import jsApi from '../fakeApi';

const initializeJsApi = () => {
	if (process.env.NODE_ENV === 'development') {
		window.jsApi = jsApi;
	} else {
		top.injectJsApi && top.injectJsApi(top, window);
	}
};

export default initializeJsApi;
