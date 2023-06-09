// @flow
import {CurrentColorSettings, Settings, Tasks, Users, WorkRelations} from 'src/store/App/types';

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
	* @param {boolean} isPersonal - личный вид
	* @param {string} diagramKey - ключ диаграммы
	* @param {string} subjectUuid - ключ текущей карточки объекта
	* @return {ThunkAction}
	*/
	async getGanttVersionTitlesAndKeys (isPersonal: boolean, diagramKey: string, subjectUuid: string) {
		const url = `exec-post?func=modules.ganttSettings.getGanttVersionTitlesAndKeys&params=requestContent,user`;
		const body = {diagramKey, isPersonal, subjectUuid};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Получает список пользователей
	* @return {ThunkAction}
	*/
	async getUsers () {
		const url = `exec?func=modules.ganttSettings.getUsers&params=`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Получает настройки версий
	* @param {string} versionKey - ключ диаграммы версий
	* @param {string} timezone - часовой пояс пользователя
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
	 * Получает работы
	 * @param {boolean} worksWithoutStartOrEndDateCheckbox - состояние флажка
	 * @param {string} timezone - часовой пояс пользователя
	 * @param {string} contentCode - ключ контента, на котором расположена диаграмма
	 * @param {string} subjectUUID - UUID объекта
	 * @return {Promise<Params>}
	 */
	async getWorks (contentCode: string, subjectUUID: string, timezone: string, worksWithoutStartOrEndDateCheckbox: boolean) {
		const url = `exec-post?func=modules.ganttDataSet.getWorks&params=requestContent,user`;
		const body = {contentCode, subjectUUID, timezone, worksWithoutStartOrEndDateCheckbox};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Сохраняет настройки версий диаграммы в хранилище
	* @param {boolean} isPersonal - личный вид
	* @param {CommonSettings} - общие настройки
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	* @param {string} createdDate - дата создания
	* @param {string} subjectUUID - UUID объекта
	* @param {string} title - название версии
	* @param {Tasks} tasks - задачи на диаграмме
	* @param {WorkRelations} workRelations - объект связи между работами
	*/
	async saveGanttVersionSettingsRequest (
		isPersonal: boolean,
		commonSettings: CommonSettings,
		contentCode: string,
		createdDate: string,
		subjectUUID: string,
		title: string,
		tasks: Tasks,
		workRelations: WorkRelations
	) {
		const url = `exec-post?func=modules.ganttSettings.saveGanttVersionSettings&params=requestContent,user`;
		const body = {commonSettings, contentCode, createdDate, isPersonal, subjectUUID, tasks, title, workRelations};
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
	* Создает личный вид для диаграммы гантта
	* @param {string} contentCode - ключ диаграммы версий
	* @param {string} subjectUUID - название диаграммы
	* @param {string} timezone - название диаграммы
	*/
	async createPersonalViewDiagram (contentCode: string, subjectUUID: string, timezone: string) {
		const url = `exec-post?func=modules.ganttSettings.createPersonalDiagram&params=requestContent,user`;
		const body = {contentCode, subjectUUID, timezone};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Удаляет личный вид для диаграммы гантта
	* @param {string} contentCode - ключ диаграммы версий
	* @param {string} subjectUUID - название диаграммы
	* @param {string} timezone - название диаграммы
	*/
	async deletePersonalViewDiagram (contentCode: string, subjectUUID: string, timezone: string) {
		const url = `exec-post?func=modules.ganttSettings.deletePersonalDiagram&params=requestContent,user`;
		const body = {contentCode, subjectUUID, timezone};
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
	* @param {string} timezone - часовой пояс пользователя
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
	* Применяет версию
	* @param {string} diagramKey - ключ диаграммы
	* @param {Tasks} tasksClone - копия задач на диаграмме
	* @param {WorkRelations} workRelations - объект связи между работами
	* @param {string} subjectUUID - Uuid объекта
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	*/
	async applyVersion (diagramKey: string, tasksClone: Tasks, workRelations: WorkRelations, contentCode: string, subjectUuid: string) {
		const url = `exec-post?func=modules.ganttSettings.applyVersion&params=requestContent`;
		const body = {contentCode, diagramKey, subjectUuid, tasksClone, workRelations};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Добавляет новую работу в диаграмму версий
	* @param {string} classFqn - метакласс работы
	* @param {string} timezone - часовой пояс пользователя
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
	* @param {string} timezone - часовой пояс пользователя
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

	async getDiagramData (contentCode: string, subjectUUID: string, timezone: string, isPersonal: boolean) {
		const url = `exec-post?func=modules.ganttDataSet.getGanttDiagramData&params=requestContent,user`;
		const body = {
			contentCode,
			isPersonal,
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
	* Получает данные для работы
	* @param {string} workUUID - идентификатор работы
	* @param {string} diagramKey - ключ диаграммы
	* @returns {ThunkAction}
	*/
	async getWorkDataForWork (workUUID: string, diagramKey: string) {
		const url = `exec?func=modules.ganttWorkHandler.getWorkPageLink&params=%27${workUUID}%27,%27${diagramKey}%27`;
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Проверяет работы ресурса
	* @param {string} workId - идентификатор работы
	* @param {string} resourceId - идентификатор ресурса
	* @param {string} diagramKey - ключ диаграммы
	* @returns {ThunkAction}
	*/
	async checkWorksOfResource (workId: string, resourceId: string, diagramKey: string, tIndex, versionKey) {
		const url = `exec-post?func=modules.ganttSettings.checkWorksOfResource&params=requestContent`;
		const body = {
			diagramKey,
			positionElement: tIndex,
			resourceId,
			versionKey,
			workId
		};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCall(url, options);
	}

	/**
	* Сохраняет настройки цветов
	* @param {CurrentColorSettings} currentColorSettings - список сущностей
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	* @param {string} subjectUUID - UUID объекта
	* @returns {ThunkAction}
	*/
	async saveGanttColorSettings (currentColorSettings: CurrentColorSettings, contentCode: string, subjectUUID: string) {
		const url = `exec-post?func=modules.ganttSettings.saveGanttColorSettings&params=requestContent,user`;
		const body = {
			contentCode,
			currentColorSettings,
			subjectUUID
		};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCall(url, options);
	}

	async getDataSources () {
		const url = 'exec?func=modules.ganttSettings.getDataSources&params=';
		const options = {
			method: 'GET'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	// На следующую итерацию
	// /**
	// * Добавляет новую работу
	// * @param {WorkData} workData - данные работы
	// * @param {string} classFqn - метакласс работы
	// * @param {string} workUUID - идентификатор работы
	// * @param {string} timezone - таймзона
	// */
	// async addNewWork (workData: WorkData, classFqn: string, timezone: string, attr) {
	// 	const url = `exec-post?func=modules.ganttWorkHandler.addNewWork&params=requestContent,user`;
	// 	const body = {classFqn, timezone, workData, attr};
	// 	const options = {
	// 		body: JSON.stringify(body),
	// 		method: 'POST'
	// 	};

	// 	this.jsApi.restCallAsJson(url, options);
	// }

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
	* @param {string} timezone - часовой пояс пользователя
	* @param {string} workUUID - идентификатор работы
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
	* @param {string} subjectUuid - UUID объекта
	*/
	async editWorkData (workData: WorkData, classFqn: string, timezone: string, workUUID: string, contentCode: string, subjectUuid: string) {
		const url = `exec-post?func=modules.ganttWorkHandler.editWorkData&params=requestContent,user`;
		const body = {classFqn, contentCode, subjectUuid, timezone, workData, workUUID};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	 * Получает атрибуты работы
	 * @param {string} attributeGroupCode - код группы атрибутов
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
	* @param  {string} timezone - часовой пояс пользователя
	* @param  {workDateInterval} workDateInterval - объект временных рамок работы
	* @param  {string} contentCode - ключ контента, на котором расположена диаграмма
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
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
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

	/**
	* Получает данные атрибутов статуса контрольной точки
	* @param {workRelations} classFqn - метакласс работы
	* @param {string} parentClassFqn - метакласс родителя работы
	*/
	async getDataAttributesControlPointStatus (classFqn: string, parentClassFqn: string) {
		const url = `exec-post?func=modules.ganttSettings.getDataAttributesControlPointStatus&params=requestContent`;
		const body = {classFqn, parentClassFqn};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		return this.jsApi.restCallAsJson(url, options);
	}

	/**
	* Отправляет пользователей
	* @param {Users} data - данные пользователей
	*/
	async postUsers (data: Users) {
		const url = `exec-post?func=modules.ganttSettings.postDataUsers&params=requestContent`;
		const body = {data};
		const options = {
			body: JSON.stringify(body),
			method: 'POST'
		};

		this.jsApi.restCallAsJson(url, options);
	}

	async postData (timezone, subjectUUID: string, contentCode: string, data: Settings) {
		const url = `exec-post?func=modules.ganttSettings.saveGanttSettings&params=requestContent`;
		const body = {
			contentCode: contentCode,
			ganttSettings: data,
			subjectUUID: subjectUUID,
			timezone: timezone
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
	* @param {string} contentCode - ключ контента, на котором расположена диаграмма
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
