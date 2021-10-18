import attributesData from 'utils/mocks/attributesData';
import startSetting from 'utils/mocks/startSetting';

export default class FakeApi {
	async getCurrentUser () {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return {
			admin: true,
			licensed: true,
			login: 'UserLogin',
			roles: ['ROLE_SUPERUSER', 'ROLE_ADMIN', 'ROLE_OPERATOR'],
			title: 'UserTitle',
			uuid: 'uuidUser'
		};
	}

	async getAttributesData () {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return attributesData;
	}

	async getStartSettings (claimUUID, user) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return startSetting;
	}

	getSubjectUuid () {
		return 'root$101';
	}
}