// @flow
export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
		this.appBaseUrl = top.appBaseUrl;
		this.location = top.location;
		window.SockJS = top.SockJS;
		window.StompJs = top.StompJs;
	}

	async getEntity () {
		return this.jsApi.restCallModule('documentDecisionsVerify', 'getVerifyResult');
	}
}
