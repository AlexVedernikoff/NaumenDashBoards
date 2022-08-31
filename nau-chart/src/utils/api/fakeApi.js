import data from 'utils/mocks/data';

export default class FakeApi {
	async getScheme () {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		return data;
	}
}
