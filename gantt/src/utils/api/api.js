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
	 * Получает аттрибуты работы
	 * @param {string} attributeGroupCode - код группы аттрибутов
	 * @param {string} metaClassFqn - метакласс работы
	 * @param {string} workUUID - идентификатор работы
	 * @returns {ThunkAction}
	 */
	async getWorkAttributes (metaClassFqn, attributeGroupCode, workUUID) {
		const url = `exec?func=modules.ganttWorkHandler.getWorkAttributes&params=%27${metaClassFqn}%27,%27${attributeGroupCode}%27,${null}`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Отправляет данные изменения временных рамок работ
	* @param  {string} timezone - таймзона
	* @param  {workDateInterval} workDateInterval -Объект временных рамок работы
	* @param  {string} contentCode - code объекта
	* @param  {string} subjectUuid - Uuid объекта
	* @param  {string} user - user объект
	*/
	async postChangedWorkInterval (timezone: string, workDateInterval: workDateInterval, contentCode, subjectUuid, user: UserData) {
		const url = `exec?func=modules.ganttWorkHandler.editWorkDateRanges&params=requestContent,user`;
		const body = {contentCode, subjectUuid, timezone, workDateInterval};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCall(url, options);
	}

	/**
	* Отправляет данные изменненых рабочих связей
	* @param workRelations - объект связи между работами
	* @param contentCode - code объекта
	* @param subjectUuid -  Uuid объекта
	*/
	async postChangedWorkRelations (workRelations, contentCode: string, subjectUuid: string) {
		const url = `exec?func=modules.ganttSettings.storeWorkRelations&params=requestContent`;
		const body = {contentCode, subjectUuid, workRelations};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	async getDataSourceAttributes (classFqn: string, parentClassFqn: string) {
		const url = `exec-post?func=modules.ganttSettings.getDataSourceAttributes&params=requestContent`;
		const body = {classFqn, parentClassFqn};
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
		const body = {
			contentCode: contentCode,
			ganttSettings: data,
			subjectUUID: subjectUuid
		};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Отправляет данные изменения прогресса работы
	* @param {string} workUUID - идентификатор работы
	* @param {number} progress - прогресс работы
	* @param {string} contentCode - code объекта
	* @param {string} subjectUUID - Uuid объекта
	*/
	async postChangedWorkProgress (workUUID: string, progress: number, contentCode: string, subjectUUID) {
		const url = `exec-post?func=modules.ganttWorkHandler.changeWorkProgress&params=requestContent`;
		const body = {contentCode, progress, subjectUUID, workUUID};

		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
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
