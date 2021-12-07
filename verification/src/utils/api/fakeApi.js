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

	async getAttributesData (claimUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return attributesData;
	}

	async getStartSettings (claimUUID, user) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return startSetting;
	}

	async setValueAndTaskState (code, claimUUID, values) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return {attrCode: 'checkA17', isFullChecked: false, message: 'Проводится проверка обращения'};
	}

	getSubjectUuid () {
		return 'root$101';
	}
}
