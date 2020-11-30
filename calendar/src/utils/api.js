// @flow
import decorateRestCallModule from './restCallModuleDecorator';
import jsApi from '../fakeApi';

const initializeJsApi = () => {
	if (process.env.NODE_ENV === 'development') {
		window.jsApi = jsApi;
	} else {
		top.injectJsApi && top.injectJsApi(top, window);
		decorateRestCallModule(window.jsApi.restCallModule);
		window.top.Array.prototype.find = Array.prototype.find;
		window.top.Array.prototype.findIndex = Array.prototype.findIndex;
		window.top.Array.prototype.includes = Array.prototype.includes;
	}
};

export default initializeJsApi;
