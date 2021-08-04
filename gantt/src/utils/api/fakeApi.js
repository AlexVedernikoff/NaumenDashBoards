import getSettings from 'utils/helpers/getSettings';
import getSources from 'utils/helpers/getSources';

export default class FakeApi {
	async getParams () {
		await new Promise(resolve => setTimeout(() => resolve(), 1300));
		return {
		};
	}

	async getInitialSettings () {
		return getSettings;
	}

	async getDataSources () {
		return getSources;
	}

	getSubjectUuid () {
		return 'serviceCall$2308201';
	}
}
