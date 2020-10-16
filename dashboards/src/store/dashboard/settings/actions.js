// @flow
import {addLayouts, setMobileLayouts, setWebLayouts} from 'store/dashboard/layouts/actions';
import {addWidget, resetWidget, setWidgets} from 'store/widgets/data/actions';
import type {AutoUpdateSettings, LayoutMode} from './types';
import {batch} from 'react-redux';
import {createToast} from 'store/toasts/actions';
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {fetchAllBuildData} from 'store/widgets/buildData/actions';
import {getContext, getMetaCLass, getUserData, setTemp, setUserData, switchDashboard} from 'store/context/actions';
import {getDataSources} from 'store/sources/data/actions';
import isMobile from 'ismobilejs';
import {LOCAL_STORAGE_VARS} from 'store/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import {resetState, switchState} from 'store/actions';
import {setCustomGroups} from 'store/customGroups/actions';
import type {User} from 'store/users/types';

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
 * @returns {ThunkAction}
 */
const getSettings = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {context, dashboard} = getState();
	const {contentCode, subjectUuid: classFqn} = context;
	const payload = {
		classFqn,
		contentCode,
		isMobile: isMobile().any,
		isPersonal: dashboard.settings.personal
	};
	const {
		autoUpdate,
		customGroups,
		layouts,
		mobileLayouts,
		widgets
	} = await window.jsApi.restCallModule('dashboardSettings', 'getSettings', payload);

	if (customGroups !== null) {
		dispatch(setCustomGroups(customGroups));
	}

	if (autoUpdate !== null) {
		dispatch(setAutoUpdateSettings(autoUpdate));
	}

	batch(() => {
		dispatch(setWidgets(widgets));
		dispatch(fetchAllBuildData(widgets));
		dispatch(setWebLayouts(widgets, layouts));
		dispatch(setMobileLayouts(widgets, mobileLayouts));
	});
};

/**
 * Устанавливает настройки автообновления
 * @param {AutoUpdateSettings} settings - настройки автообновления
 * @returns {ThunkAction}
 */
const setAutoUpdateSettings = (settings: $Shape<AutoUpdateSettings>): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {defaultInterval} = getState().dashboard.settings.autoUpdate;
	const {interval = defaultInterval} = settings;
	const remainder = interval * 60;

	dispatch(changeAutoUpdateSettings({...settings, remainder}));
};

/**
 * Изменяет остаток времени автообновления
 * @param {number} remainder - отстаток времени
 * @returns {ThunkAction}
 */
const changeIntervalRemainder = (remainder: number): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	if (remainder === 0) {
		dispatch(getSettings());
	}

	dispatch({
		payload: remainder,
		type: DASHBOARD_EVENTS.CHANGE_INTERVAL_REMINDER
	});
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
		const {editable} = dashboard.settings;
		const payload = {
			classFqn,
			contentCode,
			editable
		};
		await window.jsApi.restCallModule('dashboardSettings', 'createPersonalDashboard', payload);

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
		await window.jsApi.restCallModule('dashboardSettings', 'deletePersonalDashboard', subjectUuid, contentCode);

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
 * Загружает файл на сервер
 * @param {Blob} file - файл
 * @param {string} name - имя файла
 * @returns {string} key - ключ файла, для обращения на сервере
 */
const uploadFile = async (file: Blob, name: string) => {
	const formData = new FormData();
	formData.append('file', file, name);
	// $FlowFixMe
	const csrf = Array.from(window.top.document.head.getElementsByTagName('meta')).find(m => m.name === '_csrf').content;
	const response = await fetch(`/sd/operator/upload?_csrf=${csrf}`, {
		body: formData,
		method: 'POST'
	});

	let key = await response.text();
	key = key.split('::')[1];
	key = key.substr(0, key.length - 1);

	return key;
};

/**
 * Отправка файла на почту
 * @param {string} name - название файла
 * @param {string} type - тип файла
 * @param {Blob} file - файл для отправки
 * @param {Array<User>} users - список пользователей, которым осуществляется отправка файла
 * @returns {ThunkAction}
 */
const sendToEmails = (name: string, type: string, file: Blob, users: Array<User>): ThunkAction => async (dispatch: Dispatch) => {
	dispatch({
		type: DASHBOARD_EVENTS.REQUEST_EXPORTING_FILE_TO_EMAIL
	});

	try {
		const key = await uploadFile(file, name);
		await window.jsApi.restCallModule('dashboardSendEmail', 'sendFileToMail', key, type, name, users);

		dispatch({
			type: DASHBOARD_EVENTS.RESPONSE_EXPORTING_FILE_TO_EMAIL
		});
		dispatch(createToast({
			text: 'Файл успешно отправлен'
		}));
	} catch (e) {
		dispatch({
			type: DASHBOARD_EVENTS.RECORD_EXPORTING_FILE_TO_EMAIL_ERROR
		});
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
	const {context, sources} = getState();
	const {contentCode} = context;
	const {metaClass} = await window.jsApi.commands.getCurrentContextObject();
	const key = `widgetContext_${metaClass}_${contentCode}`;
	const descriptorStr = localStorage.getItem(key);

	if (descriptorStr) {
		const newWidget: Object = new NewWidget();
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

		dispatch(addLayouts(NewWidget.id));
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
		const {personal: isPersonal} = dashboard.settings;
		const autoUpdateSetting = {enabled, interval: Number(interval)};
		const payload = {
			autoUpdate: autoUpdateSetting,
			classFqn,
			contentCode,
			isPersonal
		};
		await window.jsApi.restCallModule('dashboardSettings', 'saveAutoUpdateSettings', payload);

		dispatch(setAutoUpdateSettings(autoUpdateSetting));
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
 * Создает состояние для дашборда
 * @returns {ThunkAction}
 */
const createNewState = () => async (dispatch: Dispatch, getState: GetState) => {
	const {personal} = getState().dashboard.settings;

	dispatch(resetState());
	dispatch(getAutoUpdateSettings());
	dispatch(setPersonal(!personal));
	dispatch(setEditable(!personal));
	await dispatch(getSettings());
};

/**
 * Переключает режим отображения
 * @param {string} payload - название режима отображения
 * @returns {ThunkAction}
 */
const changeLayoutMode = (payload: LayoutMode): ThunkAction => (dispatch: Dispatch) => {
	localStorage.setItem(LOCAL_STORAGE_VARS.LAYOUT_MODE, payload);

	dispatch({
		payload,
		type: DASHBOARD_EVENTS.CHANGE_LAYOUT_MODE
	});
};

const setPersonal = (payload: boolean) => (dispatch: Dispatch) => {
	localStorage.setItem(LOCAL_STORAGE_VARS.PERSONAL_DASHBOARD, payload.toString());

	dispatch({
		payload,
		type: DASHBOARD_EVENTS.SET_PERSONAL
	});
};

const changeAutoUpdateSettings = payload => ({
	payload,
	type: DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS
});

const setEditable = (payload: boolean) => ({
	payload,
	type: DASHBOARD_EVENTS.SET_EDITABLE_PARAM
});

export {
	changeIntervalRemainder,
	changeLayoutMode,
	createPersonalDashboard,
	createNewState,
	editDashboard,
	fetchDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToEmails,
	setEditable
};
