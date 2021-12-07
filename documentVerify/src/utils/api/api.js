// @flow
export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	getFileUuid () {
		return window.jsApi.getFileUuid();
	}

	getSubjectUuid () {
		return this.jsApi.extractSubjectUuid();
	}

	async getVerifyResult (decisionUUID: string, fileUUID: string) {
		const url = `exec-post?func=modules.documentDecisionsVerify.getVerifyResult&params=requestContent`;
		const body = {decisionUUID, fileUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}
}
