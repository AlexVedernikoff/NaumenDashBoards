// @flow
import type {Context, UserData} from './types';
import type {DefaultLocationPoints} from 'store/entity/types';

export default class Api {
	constructor () {
		top.injectJsApi(top, window);

		this.jsApi = window.jsApi;
		this.appBaseUrl = top.appBaseUrl;
		window.SockJS = top.SockJS;
		window.StompJs = top.StompJs;
	}

	async getContext (): Context {
		return {
			contentCode: this.jsApi.findContentCode(),
			currentUser: this.jsApi.getCurrentUser(),
			subjectUuid: this.jsApi.extractSubjectUuid()
		};
	}

	async getScheme (contentCode: string, subjectUuid: string, currentUser: UserData) {
		return this.jsApi.restCallModule('chartRestSettings', 'getSchemeData', subjectUuid, contentCode, currentUser);
	}

	async getEditForm (objectUUID: string, editFormCode: string) {
		return new Promise((resolve, reject) => {
			this.jsApi.commands.quickEditObject(objectUUID, editFormCode, {}, (uuid, error) => {
				if (error) {
					reject(error);
				} else {
					resolve(uuid);
				}
			});
		});
	}

	async getUuidObjects (searchString: string) {
		return this.jsApi.restCallModule('chartRestSettings', 'getUuidObjects', searchString);
	}

	async saveLocationSettings (currentUser: UserData, entitiesData: DefaultLocationPoints[]) {
		return this.jsApi.restCallModule('chartRestSettings', 'saveLocationSettings', entitiesData, currentUser);
	}

	async deleteChartSettings (currentUser: UserData) {
		return this.jsApi.restCallModule('chartRestSettings', 'deleteChartSettings', currentUser);
	}
}
