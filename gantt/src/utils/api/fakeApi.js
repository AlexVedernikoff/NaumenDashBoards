import getAttributes from 'utils/mocks/getAttributes';
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

		return {email: 'test@d.ru', groupUser: USER_ROLES.REGULAR, name: 'test'};
	}

	async getDiagramData (contentCode, subjectUuid, user, timezone) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
		return getDiagramData();
	}

	async getDataSources () {
		return getSources;
	}

	async createPersonalViewDiagram () {
		return null;
	}

	async deletePersonalViewDiagram () {
		return null;
	}

	async saveGanttColorSettings () {
		return null;
	}

	async deleteWorkDateRanges () {
		return 'Удалено';
	}

	async getAttributeGroups () {
		return getAttributes;
	}

	async addNewWork () {
		return 'Добавлено';
	}

	async editWorkData () {
		return 'Изменено';
	}

	async getWorkAttributes (metaClassFqn, attributeGroupCode, workUUID) {
		return [
			{
				'code': 'solvedByEmployee',
				'title': 'Кем решен (сотрудник)'
			},
			{
				'code': 'solveedByEmployee',
				'title': 'Кем решен (сотрудник)'
			}
		];
	}

	async getUsers () {
		return [
			{
				'code': 'Gromov Aleksey',
				'ganttMaster': true,
				'name': 'Громов Алексей'
			},
			{
				'code': 'Nosov Aleksandr',
				'ganttMaster': false,
				'name': 'Носов Александр'
			}
		];
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

	async getWorks (contentCode, subjectUUID, timezone, worksWithoutStartOrEndDateCheckbox) {
		await new Promise(resolve => setTimeout(() => resolve(), 3000));

		return [
			{
				'code': 'd951f9',
				'label': 'Дата',
				'title': 'Дата',
				'value': 'd951f9'
			},
			{
				'code': 'd951f10',
				'label': 'Конечная Дата',
				'title': 'Конечная Дата',
				'value': 'd951f10'
			}
		];
	}

	async getDataAttributesControlPointStatus (classFqn, parentClassFqn) {
		await new Promise(resolve => setTimeout(() => resolve(), 3000));

		return [
			{
				'code': 'd951f9',
				'label': 'Дата',
				'title': 'Дата',
				'value': 'd951f9'
			},
			{
				'code': 'd951f10',
				'label': 'Конечная Дата',
				'title': 'Конечная Дата',
				'value': 'd951f10'
			}
		];
	}

	async postData (timezone, subjectUuid, contentCode, data) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
		return data;
	}

	async postChangedWorkProgress (workUUID, progress, contentCode, subjectUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}

	async postChangedWorkInterval (timezone, workDateData, contentCode, subjectUuid, user) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}

	async checkWorksOfResource (workId, resourceId, diagramKey) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}

	async postChangedWorkRelations (workRelations, contentCode, subjectUuid) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}

	async editWorkDateRangesFromVersionRequest () {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}

	async applyVersion () {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}

	getGanttVersionTitlesAndKeys () {
		return [
			{'diagramKey': '4ab88ac6-9af9-49f4-9006-447216df1c97', 'title': 'test1'},
			{'diagramKey': '4ab88ac6-9af9-49f4-9006-447216df1c98', 'title': 'test2'}
		];
	}

	getGanttVersionsSettings () {
		return 'GantVersion';
	}

	getContentCode () {
		return 'GantTest';
	}

	getWorkDataForWork () {
		return {
			'PMPlanDate': true,
			'disabledCompete': false,
			'endDate': true,
			'link': 'https://nordclangant.nsd.naumen.ru/sd/operator/?anchor=uuid:serviceCall$2453008',
			'title': false
		};
	}

	getSubjectUuid () {
		return 'root$101';
	}

	openFilterForm (context) {
		return String(context);
	}

	saveGanttVersionSettingsRequest () {
		return 'root$101';
	}

	deleteGanttVersionSettingsRequest () {
		return 'root$101';
	}

	async postUsers (data) {
		await new Promise(resolve => setTimeout(() => resolve(), 300));
	}
}
