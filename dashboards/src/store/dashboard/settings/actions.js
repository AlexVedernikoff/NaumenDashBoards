// @flow
import {addLayouts, setMobileLayouts, setWebLayouts} from 'store/dashboard/layouts/actions';
import {addWidget, focusWidget, resetWidget, setWidgets} from 'store/widgets/data/actions';
import type {AutoUpdateSettings, LayoutMode} from './types';
import {batch} from 'react-redux';
import {createToast} from 'store/toasts/actions';
import {DASHBOARD_EVENTS} from './constants';
import {DiagramWidget} from 'store/widgets/data/templates';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {fetchAllBuildData} from 'store/widgets/buildData/actions';
import {getContext, getEditableParam, getMetaCLass, getUserData, setUserData, switchDashboard} from 'store/context/actions';
import {getDataSources} from 'store/sources/data/actions';
import {getLayoutMode} from 'helpers';
import {getLocalStorageValue, getUserLocalStorageId, setLocalStorageValue} from 'store/helpers';
import isMobile from 'ismobilejs';
import {LOCAL_STORAGE_VARS} from 'store/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import {resetState} from 'store/actions';
import {resizer} from 'index';
import {setCustomGroups} from 'store/customGroups/actions';
import StorageSettings from 'utils/storageSettings';
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
		dispatch(initPersonalValue());
		dispatch(initLayoutMode());

		await Promise.all([
			dispatch(getDataSources()),
			dispatch(getUserData()),
			dispatch(getSettings())
		]);

		dispatch(getPassedWidget());
		dispatch(initStorageSettings());
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
 * Инициализирует настройки дашборда сохраненные в localStorage
 * @returns {ThunkAction}
 */
const initStorageSettings = () => (dispatch: Dispatch, getState: GetState) => {
	const {code} = getState().dashboard.settings;
	const storageSettings = new StorageSettings(code);
	const {focused, targetWidget} = storageSettings.getSettings();

	if (targetWidget) {
		dispatch(focusWidget(targetWidget));
	} else if (focused) {
		resizer.scrollTo(0, 0);
	}

	storageSettings.clear();
};

/**
 * Получает настройки дашборда
 * @param {boolean} refresh - сообщает вызывается ли метод для обновления данных дашборда
 * @returns {ThunkAction}
 */
const getSettings = (refresh: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
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
		dashboardKey: code,
		layouts,
		mobileLayouts,
		widgets
	} = await window.jsApi.restCallModule('dashboardSettings', 'getSettings', payload);

	dispatch(setCode(code));

	if (customGroups !== null) {
		dispatch(setCustomGroups(customGroups));
	}

	if (autoUpdate !== null) {
		dispatch(setAutoUpdateSettings(autoUpdate));
	}

	batch(() => {
		dispatch(setWidgets(widgets));
		dispatch(fetchAllBuildData(widgets));
		dispatch(setWebLayouts(widgets, refresh, layouts));
		dispatch(setMobileLayouts(widgets, refresh, mobileLayouts));
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
		dispatch(getSettings(true));
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

	resizer.resetHeight();
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

		const {context} = getState();
		const {contentCode, editableDashboard: editable, subjectUuid: classFqn, user} = context;
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
		const {contentCode, subjectUuid, user} = context;
		await window.jsApi.restCallModule('dashboardSettings', 'deletePersonalDashboard', subjectUuid, contentCode);

		dispatch(switchDashboard(false));
		dispatch(setUserData({...user, hasPersonalDashboard: false}));
		dispatch({
			type: DASHBOARD_EVENTS.DELETED_PERSONAL_DASHBOARD
		});
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
const seeDashboard = (): ThunkAction => async (dispatch: Dispatch) => {
	dispatch(resetWidget());

	dispatch({
		type: DASHBOARD_EVENTS.SWITCH_OFF_EDIT_MODE
	});

	resizer.resize();
};

/**
 * Загружает файл на сервер
 * @param {Blob} file - файл
 * @param {string} name - имя файла
 * @returns {string} key - ключ файла, для обращения на сервере
 */
const uploadFile = async (file: Blob, name: string): Promise<string> => {
	const csrfMeta = Array.from(window.top.document.head.getElementsByTagName('meta')).find(m => m.name === '_csrf');
	let key = '';

	if (csrfMeta) {
		const formData = new FormData();
		formData.append('file', file, name);

		const response = await fetch(`/sd/operator/upload?_csrf=${csrfMeta.content}`, {
			body: formData,
			method: 'POST'
		});
		key = await response.text();

		const defaultSeparator = '::';
		const newSeparator = '@UUID_FILENAME_SPLITTER@';

		if (key.includes(defaultSeparator)) {
			key = key.substring(0, key.length - 1).split(defaultSeparator)[1];
		} else if (key.includes(newSeparator)) {
			key = key.split(newSeparator)[0].substring(2);
		}
	}

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
	const {context, dashboard, sources} = getState();
	const {contentCode} = context;
	const {metaClass} = await window.jsApi.commands.getCurrentContextObject();
	const key = `widgetContext_${metaClass.split('$')[0]}_${contentCode}`;
	let descriptorStr;

	// Данные могут сохраняться как по типу так и по классу
	[`widgetContext_${metaClass}_${contentCode}`, `widgetContext_${metaClass.split('$')[0]}_${contentCode}`].every(key => {
		descriptorStr = localStorage.getItem(key);
		return !descriptorStr;
	});

	if (descriptorStr) {
		const newWidget: Object = new DiagramWidget(dashboard.settings.layoutMode);
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
 * @param {boolean} enabled - параметр сообщает включено или выключено автообновление
 * @param {number} interval - интервал автообновления
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
const createNewState = (personalDashboard: boolean) => async (dispatch: Dispatch, getState: GetState) => {
	dispatch(resetState());
	dispatch(getAutoUpdateSettings());
	dispatch(setPersonalValue(personalDashboard));
	await dispatch(getSettings());
};

/**
 * Переключает режим отображения
 * @param {string} payload - название режима отображения
 * @returns {ThunkAction}
 */
const changeLayoutMode = (payload: LayoutMode): ThunkAction => (dispatch: Dispatch) => {
	setLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.LAYOUT_MODE, payload);

	dispatch({
		payload,
		type: DASHBOARD_EVENTS.CHANGE_LAYOUT_MODE
	});
};

const setPersonalValue = (payload: boolean) => (dispatch: Dispatch) => {
	setLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.PERSONAL_DASHBOARD, payload);

	dispatch({
		payload,
		type: DASHBOARD_EVENTS.SET_PERSONAL
	});
};

const initLayoutMode = () => ({
	payload: getLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.LAYOUT_MODE, getLayoutMode()),
	type: DASHBOARD_EVENTS.CHANGE_LAYOUT_MODE
});

const initPersonalValue = () => ({
	payload: getLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.PERSONAL_DASHBOARD, false),
	type: DASHBOARD_EVENTS.SET_PERSONAL
});

const changeAutoUpdateSettings = payload => ({
	payload,
	type: DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS
});

const setCode = payload => ({
	payload,
	type: DASHBOARD_EVENTS.SET_CODE
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
	sendToEmails
};
