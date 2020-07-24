// @flow
import {addWidget, resetWidget, setWidgets} from 'store/widgets/data/actions';
import {buildUrl, client} from 'utils/api';
import {createToast} from 'store/toasts/actions';
import {DASHBOARD_EVENTS, DEFAULT_INTERVAL} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getContext, getMetaCLass, getUserData, setTemp, setUserData, switchDashboard} from 'store/context/actions';
import {getDataSources} from 'store/sources/data/actions';
import {getNextRow} from 'utils/layout';
import {NewWidget} from 'utils/widget';
import {resetState, switchState} from 'store/actions';
import {setCustomGroups} from 'store/customGroups/actions';
import {setDynamicGroups} from 'store/sources/dynamicGroups/actions';

/**
 * Получает и устанавливает настройки автообновления
 * @returns {ThunkAction}
 */
const getAutoUpdateSettings = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {MinTimeIntervalUpdate: defaultInterval} = await window.jsApi.commands.getCurrentContentParameters();

	if (defaultInterval) {
		dispatch(changeAutoUpdateSettings({
			defaultInterval,
			interval: defaultInterval
		}));
	}
};

/**
 * Получает и устанавливает параметер редактируемости дашборда
 * @returns {ThunkAction}
 */
const getEditableParam = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {editable = true} = await window.jsApi.commands.getCurrentContentParameters();
	// В части случаев значение приходит строкой
	dispatch(setEditable(editable.toString() === 'true'));
};

/**
 * Получает данные, необходимые для работы дашборда
 * @returns {ThunkAction}
 */
const fetchDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		type: DASHBOARD_EVENTS.REQUEST_DASHBOARD
	});

	try {
		dispatch(getContext());
		dispatch(getMetaCLass());
		dispatch(getAutoUpdateSettings());
		dispatch(getEditableParam());

		await Promise.all([
			dispatch(getDataSources()),
			dispatch(getUserData()),
			dispatch(getSettings())
		]);

		dispatch(getPassedWidget());
		dispatch({
			type: DASHBOARD_EVENTS.RECEIVE_DASHBOARD
		});
	} catch (error) {
		dispatch({
			type: DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR
		});
	}
};

/**
 * Получает настройки дашборда
 * @param {boolean} isPersonal - указаывает настройки какого типа необходимо получить
 * @returns {ThunkAction}
 */
const getSettings = (isPersonal: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {context} = getState();
	const {contentCode, subjectUuid: classFqn} = context;
	const {data} = await client.post(buildUrl('dashboardSettings', 'getSettings', 'requestContent,user'), {
		classFqn,
		contentCode,
		isPersonal
	});
	const {autoUpdate, customGroups, dynamicGroups, widgets} = data;

	if (customGroups !== null) {
		dispatch(setCustomGroups(customGroups));
	}

	if (autoUpdate !== null) {
		dispatch(setAutoUpdate(autoUpdate));
	}

	if (dynamicGroups) {
		dispatch(setDynamicGroups(dynamicGroups));
	}

	dispatch(setWidgets(widgets));
};

const setAutoUpdate = (autoUpdate: Object): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {
		autoUpdate: {
			fn: currentUpdateFunction
		}
	} = getState().dashboard;
	const {enabled = false, interval = DEFAULT_INTERVAL} = autoUpdate;
	let updateFunction;

	clearInterval(currentUpdateFunction);

	if (enabled) {
		updateFunction = setInterval(() => dispatch(getSettings()), interval * 1000 * 60);
	}

	dispatch(changeAutoUpdateSettings({
		...autoUpdate,
		fn: updateFunction
	}));
};

/**
 * Включает режим редактирования
 * @returns {ThunkAction}
 */
const editDashboard = (): ThunkAction => (dispatch: Dispatch) => {
	dispatch({
		type: DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE
	});
};

/**
 * Создает персональный дашборд
 * @returns {ThunkAction}
 */
const createPersonalDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		dispatch({
			type: DASHBOARD_EVENTS.CREATE_PERSONAL_DASHBOARD
		});

		const {context, dashboard} = getState();
		const {contentCode, subjectUuid: classFqn, user} = context;
		const {editable} = dashboard;
		await client.post(buildUrl('dashboardSettings', 'createPersonalDashboard', 'requestContent,user'), {
			classFqn,
			contentCode,
			editable
		});

		dispatch(setUserData({...user, hasPersonalDashboard: true}));
		dispatch({
			type: DASHBOARD_EVENTS.CREATED_PERSONAL_DASHBOARD
		});
		dispatch(switchDashboard());
	} catch (e) {
		dispatch({
			type: DASHBOARD_EVENTS.ERROR_CREATE_PERSONAL_DASHBOARD
		});
		dispatch(createToast({
			text: 'Ошибка сохранения персонального дашборда',
			time: 1500,
			type: 'error'
		}));
	}
};

/**
 * Удаляет персональный дашборд
 * @returns {ThunkAction}
 */
const removePersonalDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		dispatch({
			type: DASHBOARD_EVENTS.DELETE_PERSONAL_DASHBOARD
		});

		const {context} = getState();
		const {contentCode, subjectUuid, temp, user} = context;
		const params = `'${subjectUuid || ''}','${contentCode}',user`;
		await client.post(buildUrl('dashboardSettings', 'deletePersonalDashboard', params));

		if (temp) {
			dispatch(setTemp(null));
			dispatch(switchState(temp));
			dispatch(setUserData({...user, hasPersonalDashboard: false}));
			dispatch({
				type: DASHBOARD_EVENTS.DELETED_PERSONAL_DASHBOARD
			});
		}
	} catch (e) {
		dispatch({
			type: DASHBOARD_EVENTS.ERROR_DELETE_PERSONAL_DASHBOARD
		});
		dispatch(createToast({
			text: 'Ошибка удаления',
			time: 1500,
			type: 'error'
		}));
	}
};

/**
 * Сбрасывает выбранный виджет и выключает режим редактирования
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
 * Получает настройки, сгенерированные с adv-листа и инициализирует добавление нового виджета с этими настройками.
 * @returns {ThunkAction}
 */
const getPassedWidget = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {context, sources, widgets} = getState();
	const {contentCode} = context;
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

		const {label, value} = sources.data.map[classFqn].value;
		newWidget.name = '';
		newWidget.data[0] = {
			...newWidget.data[0],
			descriptor: descriptorStr,
			source: {
				label,
				value
			}
		};

		dispatch(addWidget(newWidget));
		dispatch(editDashboard());
		localStorage.removeItem(key);
	}
};

/**
 * Сохраняет настройки автообновления
 * @param {boolean} enabled - найстроки автообновления
 * @param {number} interval - найстроки автообновления
 * @returns {ThunkAction}
 */
const saveAutoUpdateSettings = (enabled: boolean, interval: number | string) => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {context, dashboard} = getState();
		const {contentCode, subjectUuid: classFqn} = context;
		const {personal: isPersonal} = dashboard;
		const autoUpdate = {enabled, interval};
		await client.post(buildUrl('dashboardSettings', 'saveAutoUpdateSettings', 'requestContent,user'), {
			autoUpdate,
			classFqn,
			contentCode,
			isPersonal
		});

		dispatch(setAutoUpdate(autoUpdate));
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

/**
 * Создает состояние для персонального дашборда
 * @returns {ThunkAction}
 */
const createPersonalState = () => async (dispatch: Dispatch) => {
	dispatch(resetState());
	dispatch(getAutoUpdateSettings());
	dispatch(setEditable(true));
	dispatch(setPersonal(true));
	await dispatch(getSettings(true));
};

const changeAutoUpdateSettings = payload => ({
	payload,
	type: DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS
});

const setEditable = (payload: boolean) => ({
	payload,
	type: DASHBOARD_EVENTS.SET_EDITABLE_PARAM
});

const setPersonal = payload => ({
	payload,
	type: DASHBOARD_EVENTS.SET_PERSONAL
});

export {
	createPersonalDashboard,
	createPersonalState,
	editDashboard,
	fetchDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToMail,
	setEditable
};
