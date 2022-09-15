import data from 'utils/mocks/data';

export default class FakeApi {
	async getContext () {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return {
			contentCode: 'NauChart12',
			subjectUuid: 'root$101'
		};
	}

	async getScheme () {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return data;
	}
}
