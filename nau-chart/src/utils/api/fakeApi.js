import data from 'utils/mocks/data';

export default class FakeApi {
	async getContext () {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return {
			contentCode: 'NauChart12',
			currentUser: 'user12',
			subjectUuid: 'root$101'
		};
	}

	async getScheme () {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return data;
	}

	async getEditForm (objectUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return {uuid: objectUUID};
	}

	async getUuidObjects (searchString) {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return [searchString];
	}

	async saveLocationSettings (currentUser, entitiesData) {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return {currentUser, entitiesData};
	}

	async deleteChartSettings (currentUser) {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return currentUser;
	}
}
