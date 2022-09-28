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
}
