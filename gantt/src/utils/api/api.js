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

	/**
	* Получает названия и ключи версий
	* @param {string} diagramKey - ключ диаграммы
	* @return {ThunkAction}
	*/
	async getGanttVersionTitlesAndKeys (diagramKey: string) {
		const url = `exec-post?func=modules.ganttSettings.getGanttVersionTitlesAndKeys&params=requestContent`;
		const body = {diagramKey};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Получает настройки версий
	* @param {string} versionKey - ключ диаграммы версий
	* @param {string} timezone - таймзона устройства пользователя
	* @return {ThunkAction}
	*/
	async getGanttVersionsSettings (versionKey: string, timezone: string) {
		const url = `exec-post?func=modules.ganttDataSet.getGanttVersionDiagramData&params=requestContent,user`;
		const body = {versionKey, timezone};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Сохраняет настройки версий диаграммы в хранилище
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	* @param {string} createdDate - дата создания
	* @param {string} subjectUUID - UUID объекта
	* @param {string} title - название версии
	*/
	async saveGanttVersionSettingsRequest (contentCode: string, createdDate: string, subjectUUID: string, title: string) {
		const url = `exec-post?func=modules.ganttSettings.saveGanttVersionSettings&params=requestContent`;
		const body = {contentCode, createdDate, subjectUUID, title};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Изменяет настройки в диаграмме версий
	* @param {string} versionKey - ключ диаграммы версий
	* @param {string} title - название диаграммы
	*/
	async updateGanttVersionSettingsRequest (versionKey: string, title: string) {
		const url = `exec-post?func=modules.ganttSettings.updateGanttVersionSettings&params=requestContent,%27${versionKey}%27`;
		const body = {title, versionKey};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Удаляет диаграмму версий из хранилища
	* @param {string} ganttVersionId  - индекс диаграммы
	*/
	async deleteGanttVersionSettingsRequest (ganttVersionId: string) {
		const url = `exec-post?func=modules.ganttSettings.deleteGanttVersionSettings&params=%27${ganttVersionId}%27`;
		const options = {
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Редактирукт диапазон дат работ диаграмм версий
	* @param {string} subjectUUID - Uuid объекта
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	* @param {string} timezone - таймзона устройства пользователя
	* @param {string} versionKey - ключ диаграммы версий
	* @param {workDateInterval} workDateInterval - объект временных рамок работы
	*/
	async editWorkDateRangesFromVersionRequest (subjectUUID: string, contentCode: string, timezone: string, versionKey: string, workDateInterval: workDateInterval) {
		const url = `exec-post?func=modules.ganttWorkHandler.editWorkDateRangesForVersion&params=requestContent,user,%27${versionKey}%27`;
		const body = {contentCode, subjectUUID, timezone, workDateInterval};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Добавляет новую работу в диаграмму версий
	* @param {string} classFqn - метакласс работы
	* @param {string} timezone - таймзона устройства пользователя
	* @param {string} versionKey - ключ диаграммы версий
	* @param {workData} workData - данные работы
	*/
	async addNewWorkForVersionRequest (classFqn: string, timezone: string, versionKey: string, workData: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.addNewWorkForVersion&params=requestContent,user,%27${versionKey}%27`;
		const body = {classFqn, timezone, workData};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Редактирует работы в диаграмме версий
	* @param {string} classFqn - метакласс работы
	* @param {string} workUUID - индефекатор работы
	* @param {string} versionKey - ключ диаграммы версий
	* @param {workData} workData - данные работы
	* @param {string} timezone - таймзона устройства пользователя
	*/
	async editWorkDataFromVersionRequest (classFqn: string, workUUID: string, versionKey: string, workData: string, timezone) {
		const url = `exec-post?func=modules.ganttWorkHandler.editWorkDataFromVersion&params=requestContent,user,%27${versionKey}%27`;
		const body = {classFqn, timezone, workData, workUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Редактирует прогресс работы в диаграмме версий
	* @param {string} versionKey - ключ диаграммы версий
	* @param {string} workUUID - индефекатор работы
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	* @param {string} subjectUUID - ключ текущей карточки объекта
	* @param {string} progress - прогресс работы
	*/
	async changeWorkProgressFromVersionRequest (versionKey: string, workUUID: string, contentCode: string, subjectUUID: string, progress: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.changeWorkProgressFromVersion&params=requestContent,user,%27${versionKey}%27`;
		const body = {contentCode, progress, subjectUUID, workUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Удаляет задачу из диаграммы версий
	* @param versionKey - ключ диаграммы версий
	* @param workUUID - UUID редактируемой работы
	*/
	async deleteWorkFromVersionDiagramRequest (workUUID: string, versionKey: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.deleteWorkFromVersion&params=requestContent,user,%27${versionKey}%27`;
		const body = {versionKey, workUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Получает данные для построения версий диаграммы Ганта
	* @returns {ThunkAction}
	*/
	async getGanttVersionDiagramData () {
		const url = `exec?func=modules.ganttDataSet.getGanttVersionDiagramData&params=user`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCall(url, options);
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

	async getDiagramData (contentCode: string, subjectUUID: string, timezone: string) {
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

	/**
	* Получает ссылку на страницу работы
	* @param {string} workUUID - идентификатор работы
	* @returns {ThunkAction}
	*/
	async getWorkPageLink (workUUID: string) {
		const url = `exec?func=modules.ganttWorkHandler.getWorkPageLink&params=%27${workUUID}%27`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCall(url, options);
	}

	async getDataSources () {
		const url = 'exec?func=modules.ganttSettings.getDataSources&params=';
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Добавляет новую работу
	* @param {WorkData} workData - данные работы
	* @param {string} classFqn - метакласс работы
	* @param {string} workUUID - идентификатор работы
	* @param {string} timezone - таймзона
	*/
	async addNewWork (workData: WorkData, classFqn: string, timezone: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.addNewWork&params=requestContent,user`;
		const body = {classFqn, timezone, workData};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Удаляет работу
	* @param {string} workUUID - идентификатор работы
	*/
	async deleteWorkDateRanges (workUUID) {
		const url = `exec-post?func=modules.ganttWorkHandler.deleteWorkDateRanges&params=%27${workUUID}%27`;
		const options = {
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Изменяет данные работы
	* @param {WorkData} workData - данные работы
	* @param {string} classFqn - метакласс работы
	* @param {string} workUUID - идентификатор работы
	* @param {string} timezone - таймзона
	*/
	async editWorkData (workData: WorkData, classFqn: string, timezone: string, workUUID: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.editWorkData&params=requestContent,user`;
		const body = {classFqn, timezone, workData, workUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	 * Получает аттрибуты работы
	 * @param {string} attributeGroupCode - код группы аттрибутов
	 * @param {string} metaClassFqn - метакласс работы
	 * @param {string} workUUID - идентификатор работы
	 * @returns {ThunkAction}
	 */
	async getWorkAttributes (metaClassFqn, attributeGroupCode, workUUID: string) {
		const url = `exec?func=modules.ganttWorkHandler.getWorkAttributes&params=%27${metaClassFqn}%27,%27${attributeGroupCode}%27,${null}`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Отправляет данные изменения временных рамок работ
	* @param  {string} timezone - таймзона
	* @param  {workDateInterval} workDateInterval - объект временных рамок работы
	* @param  {string} contentCode - code объекта
	* @param  {string} subjectUUID - UUID объекта
	*/
	async postChangedWorkInterval (timezone: string, workDateInterval, contentCode: string, subjectUUID: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.editWorkDateRanges&params=requestContent,user`;
		const body = {contentCode, subjectUUID, timezone, workDateInterval};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCall(url, options);
	}

	/**
	* Отправляет данные изменненых рабочих связей
	* @param {workRelations} workRelations - объект связи между работами
	* @param {string} contentCode - code объекта
	* @param {string} subjectUUID -  UUID объекта
	*/
	async postChangedWorkRelations (workRelations, contentCode: string, subjectUUID: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.storeWorkRelations&params=requestContent`;
		const body = {contentCode, subjectUUID, workRelations};
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

	async postData (subjectUUID: string, contentCode: string, data: Settings) {
		const url = `exec-post?func=modules.ganttSettings.saveGanttSettings&params=requestContent`;
		const body = {
			contentCode: contentCode,
			ganttSettings: data,
			subjectUUID: subjectUUID
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
	* @param {string} subjectUUID - UUID объекта
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
