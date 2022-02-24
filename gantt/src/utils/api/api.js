// @flow
import {Settings, UserData} from 'src/store/App/types';

export default class Api {
	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	async getParams () {
		return this.jsApi.contents.getParameters();
	}

	async getCurrentUser () {
		return window.jsApi.getCurrentUser();
	}

	async getInitialSettings (contentCode: string, subjectUUID: string) {
		const url = `exec-post?func=modules.ganttSettings.getGanttSettings&params=requestContent,user`;
		const body = {contentCode, subjectUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async getUserData (contentCode: string, subjectUUID: string) {
		const url = `exec-post?func=modules.ganttSettings.getUserData&params=requestContent,user`;
		const body = {contentCode, subjectUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async getDiagramData (contentCode: string, subjectUUID: string, user: UserData, timezone: string) {
		const url = `exec-post?func=modules.ganttDataSet.getGanttDiagramData&params=requestContent,user`;
		const body = {
			contentCode,
			subjectUUID,
			timezone
		};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async getDataSources () {
		const url = 'exec?func=modules.ganttSettings.getDataSources&params=';
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Получает группы аттрибутов
	* @param  {string} metaClass - метакласс задачи
	* @returns {ListOfAttributes}
	*/
	async getAttributeGroups (metaClass) {
		const url = `exec?func=modules.ganttWorkHandler.getAttributeGroups&params=${metaClass}`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async getDataSourceAttributes (classFqn: string, parentClassFqn: string) {
		const url = `exec-post?func=modules.ganttSettings.getDataSourceAttributes&params=requestContent`;
		const body = {
			classFqn, parentClassFqn};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async getDataSourceAttributesByTypes (classFqn: string, types: string) {
		const url = `exec-post?func=modules.ganttSettings.getDataSourceAttributes&params=requestContent`;
		const body = {classFqn, types};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	async postData (subjectUuid: string, contentCode: string, data: Settings) {
		const url = `exec-post?func=modules.ganttSettings.saveGanttSettings&params=requestContent`;
		const body = {contentCode, data, subjectUuid};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Отправляет данные обновленной задачи
	* @param  {string} startDate - дата и время начала задачи
	* @param  {string} endDate - дата и время окончания задачи
	* @param  {string | number} subjectUuid - идентификатор задачи
	*/
	async postChangeProgress (workUUID: string, progress: number, contentCode: string, subjectUUID) {
		const url = `exec-post?func=modules.ganttWorkHandler.changeWorkProgress&params=requestContent`;
		const body = {contentCode, progress, subjectUUID, workUUID};

		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	getContentCode () {
		return this.jsApi.findContentCode();
	}

	getSubjectUuid () {
		return this.jsApi.extractSubjectUuid();
	}

	openFilterForm (context: string) {
		return this.jsApi.commands.filterForm(context);
	}
}
