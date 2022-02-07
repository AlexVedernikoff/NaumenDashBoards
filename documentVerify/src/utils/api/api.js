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

	getSubjectUuid () {
		return this.jsApi.extractSubjectUuid();
	}

	async getVerifyResult (decisionUUID: string) {
		return this.jsApi.restCallModule('documentDecisionsVerify', 'getVerifyResult', decisionUUID);
	}

	async getVerifyDocument (documentUUID: string) {
		const response = await fetch(`${this.location.origin}/sd/operator/download?uuid=${documentUUID}`);
		const data = await response.blob();
		return data.text();
	}

	async updateEntityStatus (revisionUUID: string, status: string) {
		return this.jsApi.restCallModule('documentDecisionsVerify', 'editEntityState', revisionUUID, status);
	}

	async generateDocument (documentUUID: string) {
		return this.jsApi.restCallModule('documentDecisionsVerify', 'createExitDocument', documentUUID);
	}

	async getWsDocument (documentUUID: string) {
		this.jsApi.ws.connect(function () {
			this.jsApi.ws.subscribe(`documentSolution.${documentUUID}`, function (message) {

			});
		});
	}
}
