import {getDiagramData} from 'utils/mocks/getDiagramData';
import getSettings from 'utils/mocks/getSettings';
import getSources from 'utils/mocks/getSources';
import {USER_ROLES} from 'store/App/constants';

export default class FakeApi {
	async getParams () {
		await new Promise(resolve => setTimeout(() => resolve(), 1300));
		return {
		};
	}

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

	async getInitialSettings (contentCode, subjectUuid) {
		await new Promise(resolve => setTimeout(() => resolve(), 1200));
		return getSettings;
	}

	async getUserData (contentCode, subjectUuid) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		if (Math.random() < 0) {
			return {groupUser: USER_ROLES.REGULAR};
		}

		return {email: 'test@d.ru', groupUser: USER_ROLES.MASTER, name: 'test'};
	}


	async getDiagramData (contentCode, subjectUuid, user, timezone) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
		return getDiagramData();
	}

	async getDataSources () {
		return getSources;
	}

	async getDataSourceAttributes (classFqn, parentClassFqn) {
		await new Promise(resolve => setTimeout(() => resolve(), 3000));

		return [
			{
				'class': '12',
				'code': 'title',
				'title': 'Название',
				'type': 'string'
			},
			{
				'code': '234',
				'title': 'Исполнитель',
				'type': 'object'
			},
			{
				'code': 'd951f9',
				'title': 'Дата',
				'type': 'bool'
			}
		];
	}

	async getDataSourceAttributesByTypes (classFqn, parentClassFqn) {
		await new Promise(resolve => setTimeout(() => resolve(), 3000));

		return [
			{
				'code': 'd951f9',
				'title': 'Дата'
			}
		];
	}

	async postData (subjectUuid, contentCode, data) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
		return data;
	}

	async postDataTasks (endDate, startDate, subjectUuid) {
		const answer = await new Promise(resolve => setTimeout(() => resolve({
			endDate: '2021-11-13T15:55:26',
			startDate: '2021-11-11T15:55:26',
			subjectUuid: 'serviceCall$2361601_cf19df0a-b957-4d6a-95e4-e70f438d1a0a'
		}), 300));
		return answer;
	}

	getContentCode () {
		return 'GantTest';
	}

	getSubjectUuid () {
		return 'root$101';
	}

	openFilterForm (context) {
		return String(context);
	}
}
