// @flow
export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	getSubjectUuid () {
		return this.jsApi.extractSubjectUuid();
	}

	async getVerifyResult (decisionUUID: string) {
		const url = `exec?func=modules.documentDecisionsVerify.getVerifyResult&params='${encodeURIComponent(decisionUUID)}'`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}
}
