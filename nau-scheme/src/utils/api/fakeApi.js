import data from 'utils/mocks/data';

export default class FakeApi {
	async getEntity () {
		await new Promise(resolve => setTimeout(() => resolve(), 500));
		return data.entities;
	}
}
