// @flow
export default class Api {
	constructor () {
		top.injectJsApi(top, window);

		this.jsApi = window.jsApi;
		this.appBaseUrl = top.appBaseUrl;
		this.location = top.location;
		window.SockJS = top.SockJS;
		window.StompJs = top.StompJs;
	}

	async getContext () {
		return {
			contentCode: this.jsApi.findContentCode(),
			subjectUuid: this.jsApi.extractSubjectUuid()
		};
	}

	async getScheme (contentCode: string, subjectUuid: string) {
		return this.jsApi.restCallModule('schemeRestSettings', 'getSchemeData', subjectUuid, contentCode);
	}
}
