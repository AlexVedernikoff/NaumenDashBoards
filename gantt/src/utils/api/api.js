export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	async getParams () {
		return this.jsApi.contents.getParameters();
	}

	async getInitialSettings () {
		// TODO пока бек не готов
		return this.jsApi.restCallAsJson('restSettings', 'getObjects');
	}

	async getDataSources () {
		// TODO пока бек не готов
		return this.jsApi.restCallAsJson('restSettings', 'getDataSources');
	}

	getSubjectUuid () {
		return this.jsApi.extractSubjectUuid();
	}
}
