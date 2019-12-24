// @flow
import {addWidget, resetWidget, setWidgets} from 'store/widgets/data/actions';
import type {AutoUpdateRequestPayload} from './types';
import {buildUrl, client, getContentParameters, getContext} from 'utils/api';
import type {Context} from 'utils/api/types';
import {createToast} from 'store/toasts/actions';
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {fetchAllBuildData} from 'store/widgets/buildData/actions';
import {getDataSources} from 'store/sources/data/actions';
import {getNextRow} from 'utils/layout';
import {NewWidget} from 'utils/widget';

/**
 * Получаем данные, необходимые для работы дашборда
 * @returns {ThunkAction}
 */
const fetchDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestDashboard);

	try {
		const context = getContext();
		const {editable, autoUpdateInterval: defaultInterval} = await getContentParameters();

		if (defaultInterval) {
			dispatch(changeAutoUpdateSettings({defaultInterval}));
			dispatch(setAutoUpdateInterval(defaultInterval));
		}

		dispatch(setContext(context));
		dispatch(setEditable(editable));

		await Promise.all([
			dispatch(getDataSources()),
			dispatch(getUserRole()),
			dispatch(getSettings())
		]);

		dispatch(getPassedWidget(context));
		dispatch(receiveDashboard());
	} catch (error) {
		dispatch(recordDashboardError());
	}
};

/**
 * Получаем настройки дашборда
 * @returns {ThunkAction}
 */
const getSettings = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {autoUpdate: {defaultInterval}, context} = getState().dashboard;
	const params = `'${context.subjectUuid || ''}','${context.contentCode}',user`;
	const {data: {autoUpdate, widgets}} = await client.post(buildUrl('dashboardSettings', 'getSettings', params));

	if (Array.isArray(widgets) && widgets.length > 0) {
		dispatch(setWidgets(widgets));
		dispatch(fetchAllBuildData(widgets));
	}

	if (autoUpdate) {
		dispatch(changeAutoUpdateSettings(autoUpdate));
		const {enabled, interval} = autoUpdate;

		if (enabled && interval > defaultInterval) {
			dispatch(setAutoUpdateInterval(interval));
		}
	}
};

const getUserRole = (): ThunkAction => async (dispatch: Dispatch) => {
	try {
		const {data: role} = await client.post(buildUrl('dashboardSettings', 'getUserRole', 'user'));
		dispatch(receiveUserRole(role));
	} catch (e) {
		dispatch(recordDashboardError());
	}
};

/**
 * Устанавливаем интервал автообновления
 * @param {number} interval - интервал обновления в минутах
 * @returns {ThunkAction}
 */
const setAutoUpdateInterval = (interval: number): ThunkAction => (dispatch: Dispatch) => {
	const fn = setInterval(() => dispatch(getSettings()), interval * 1000 * 60);

	dispatch({
		type: DASHBOARD_EVENTS.SET_AUTO_UPDATE_FUNCTION,
		payload: fn
	});
};

/**
 * Включаем режим редактирования
 * @returns {ThunkAction}
 */
const editDashboard = (): ThunkAction => (dispatch: Dispatch) => {
	dispatch({
		type: DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE
	});
};

/**
 * Сброс дашборда на дефолтные настройки мастера
 * @returns {ThunkAction}
 */
const resetDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const context = getState().dashboard.context;
		const params = `'${context.subjectUuid || ''}','${context.contentCode}',user`;
		await client.post(buildUrl('dashboardSettings', 'resetPersonalDashboard', params));

		dispatch(getSettings());
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка сброса настроек',
			type: 'error'
		}));
	}
};

/**
 * Сбрасываем выбранный виджет и выключаем режим редактирования
 * @returns {ThunkAction}
 */
const seeDashboard = (): ThunkAction => (dispatch: Dispatch) => {
	dispatch(resetWidget());
	dispatch({
		type: DASHBOARD_EVENTS.SWITCH_OFF_EDIT_MODE
	});
};

/**
 * Отправка файла на почту
 * @param {string} name - название файла
 * @param {string} type - тип файла
 * @param {Blob} file - файл для отправки
 * @returns {ThunkAction}
 */
const sendToMail = (name: string, type: string, file: Blob): ThunkAction => async (dispatch: Dispatch) => {
	const data = new FormData();
	data.append('fileBytes', file, name);
	data.append('fileFormat', type);
	data.append('fileName', name);

	try {
		await client.post(buildUrl('dashboardSendEmail', 'sendFileToMail', 'request,user'), data, {
			headers: {
				'Content-Type': 'multipart/form-data',
				timeout: 30000
			}
		});
		dispatch(createToast({
			text: 'Файл успешно отправлен'
		}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка отправки файла',
			type: 'error'
		}));
	}
};

/**
 * Получаем настройки, сгенерированные с adv-листа и инициализируем добавление нового виджета с этими настройками.
 * @param {Context} context - контекст ВП
 * @returns {ThunkAction}
 */
const getPassedWidget = (context: Context): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {contentCode} = context;
	const {sources, widgets} = getState();
	const {metaClass} = await window.jsApi.commands.getCurrentContextObject();
	const key = `widgetContext_${metaClass}_${contentCode}`;
	const descriptorStr = localStorage.getItem(key);

	if (descriptorStr) {
		const newWidget: Object = new NewWidget(getNextRow(widgets.data.map));
		const descriptor = JSON.parse(descriptorStr);
		let classFqn;

		if (Array.isArray(descriptor.cases) && descriptor.cases.length > 1) {
			classFqn = descriptor.cases[0].split('$').shift();
		} else {
			classFqn = descriptor.clazz || descriptor.cases[0];
		}

		const {title: label, value} = sources.data.map[classFqn];
		newWidget.descriptor = descriptorStr;
		newWidget.name = '';
		newWidget.source = {label, value};

		dispatch(addWidget(newWidget));
		dispatch(editDashboard());
		localStorage.removeItem(key);
	}
};

const saveAutoUpdateSettings = (autoUpdate: AutoUpdateRequestPayload) => async (dispatch: Dispatch, getState: GetState) => {
	try {
		const {subjectUuid: classFqn, contentCode} = getState().dashboard.context;
		await client.post(buildUrl('dashboardSettings', 'saveAutoUpdateSettings', 'requestContent,user'), {
			autoUpdate,
			classFqn,
			contentCode
		});

		dispatch(changeAutoUpdateSettings(autoUpdate));
		dispatch(createToast({
			text: 'Настройки успешно изменены!'
		}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка сохранения настроек',
			type: 'error'
		}));
	}
};

const changeAutoUpdateSettings = payload => ({
	type: DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS,
	payload
});

const requestDashboard = () => ({
	type: DASHBOARD_EVENTS.REQUEST_DASHBOARD
});

const receiveUserRole = payload => ({
	type: DASHBOARD_EVENTS.RECEIVE_USER_ROLE,
	payload
});

const receiveDashboard = () => ({
	type: DASHBOARD_EVENTS.RECEIVE_DASHBOARD
});

const recordDashboardError = () => ({
	type: DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR
});

const setContext = payload => ({
	type: DASHBOARD_EVENTS.SET_CONTEXT,
	payload
});

const setEditable = payload => ({
	type: DASHBOARD_EVENTS.SET_EDITABLE_PARAM,
	payload
});

export {
	editDashboard,
	fetchDashboard,
	getSettings,
	resetDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToMail
};
