// @flow
export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	async getParams () {
		return this.jsApi.contents.getParameters();
	}

	async getAttributeData () {
		const url = 'exec?func=modules.verification.attribute&params=';
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}
}
