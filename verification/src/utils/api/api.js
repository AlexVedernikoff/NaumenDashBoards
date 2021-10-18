// @flow
import {UserData} from 'store/user/types';

export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	getCurrentUser () {
		return window.jsApi.getCurrentUser();
	}

	getSubjectUuid () {
		return this.jsApi.extractSubjectUuid();
	}

	async getAttributesData () {
		const url = 'exec?func=modules.verification.getVerificationList&params=';
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async getStartSettings (claimUUID: string, user: UserData) {
		const url = `exec-post?func=modules.verification.getStartSettings&params=requestContent`;
		const body = {claimUUID, user};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}
}
