// @flow
export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;

		window.SockJS = top.SockJS;
		window.StompJs = top.StompJs;
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

	async getVerifyDocument (documentUUID: string) {
		const baseUrl = this.jsApi.rest.getBaseUrl();
		const response = await fetch(`${baseUrl}/operator/download?uuid=${documentUUID}`);
		const data = await response.blob();
		return data.text();
	}

	async getWsDocument (documentUUID: string) {
		this.jsApi.ws.connect(function () {
			console.log('connect');
			this.jsApi.ws.subscribe(`documentSolution.${documentUUID}`, function (message) {
				console.log(message);
			});
		});
	}
}
