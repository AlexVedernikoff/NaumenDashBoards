// @flow
import {addLayouts, setMobileLayouts, setWebLayouts} from 'store/dashboard/layouts/actions';
import {addNewWidget, focusWidget, resetWidget, setWidgets} from 'store/widgets/data/actions';
import api from 'api';
import {ApiError, PersonalDashboardNotFound} from 'api/errors';
import {batch} from 'react-redux';
import {changeAxisChartFormValues} from 'store/widgetForms/actions';
import {CONTEXT_EVENTS, DASHBOARD_EDIT_MODE} from 'store/context/constants';
import {createToast} from 'store/toasts/actions';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {EditPanelPosition, LayoutMode, SettingsAction} from './types';
import {EDIT_PANEL_POSITION, MAX_AUTO_UPDATE_INTERVAL} from './constants';
import {fetchBuildData} from 'store/widgets/actions';
import {getAllWidgets} from 'store/widgets/data/selectors';
import {
	getContext,
	getEditableParam,
	getMetaClass,
	getUserData,
	setTemp,
	setUserData
} from 'store/context/actions';
import {getDashboardDescription} from './selectors';
import {getDataSources} from 'store/sources/data/actions';
import {getLocalStorageValue, getUserLocalStorageId, setLocalStorageValue} from 'store/helpers';
import {getValueFromDescriptor} from 'utils/descriptorUtils';
import {isPersonalDashboard, isRestrictUserModeDashboard, isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {LOCAL_STORAGE_VARS} from 'store/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import {resizer as dashboardResizer} from 'app.constants';
import {setCustomChartsColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import StorageSettings from 'utils/storageSettings';
import t from 'localization';
import type {User} from 'store/users/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Получает и устанавливает настройки автообновления
 * @returns {ThunkAction}
 */
const getAutoUpdateSettings = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {MinTimeIntervalUpdate: value} = await api.instance.frame.getCurrentContentParameters();

	if (value) {
		let defaultInterval = 3;

		if (typeof value === 'number') { // 1.0-2.2
			defaultInterval = value;
		} else if (typeof value === 'string') { // Вероятно когда то встречалось
			defaultInterval = Number.parseInt(value);
		}

		if (!isNaN(defaultInterval)) {
			defaultInterval = Math.min(Math.max(defaultInterval, 1), MAX_AUTO_UPDATE_INTERVAL);

			dispatch(changeAutoUpdateSettings({
				defaultInterval,
				interval: defaultInterval
			}));
		}
	}
};

/**
 * Получает данные, необходимые для работы дашборда
 * @returns {ThunkAction}
 */
const fetchDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		type: 'dashboard/settings/requestDashboard'
	});

	try {
		dispatch(getContext());
		dispatch(getMetaClass());
		dispatch(getAutoUpdateSettings());
		await dispatch(getEditableParam());
		dispatch(initPersonalValue());
		dispatch(initLayoutMode());
		dispatch(initHeaderPanel());
		dispatch(initEditPanelPosition());

		await dispatch(getSettings());
		await Promise.all([
			dispatch(getDataSources()),
			dispatch(getUserData())
		]);
		dashboardResizer.resize();

		dispatch(getPassedWidget());
		dispatch(updateUserSourceMode());
		dispatch(initStorageSettings());
		dispatch({
			type: 'dashboard/settings/receiveDashboard'
		});
	} catch (exception) {
		let error = t('store::dashboard::settings::FetchDashboardErrorText');

		if (exception instanceof ApiError || process.env.NODE_ENV === 'development') {
			error = exception.message ?? t('store::dashboard::settings::FetchDashboardErrorText');
		}

		dispatch({
			payload: error,
			type: 'dashboard/settings/recordDashboardError'
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
		dashboardResizer.focus();
	}

	storageSettings.clear();
};

/**
 * Получает настройки дашборда
 * @param {boolean} refresh - сообщает вызывается ли метод для обновления данных дашборда
 * @returns {ThunkAction}
 */
const getSettings = (refresh: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const state = getState();
	const payload = getDashboardDescription(state);

	try {
		const {
			autoUpdate,
			customColorsSettings,
			dashboardKey: code,
			dashboardUUID,
			layouts,
			mobileLayouts,
			widgets
		} = await api.instance.dashboardSettings.settings.getSettings(payload);

		batch(() => {
			dispatch(setCode(code));
			dispatch(setCustomChartsColorsSettings(customColorsSettings));
			dispatch(setDashboardUUID(dashboardUUID));

			if (autoUpdate !== null) {
				dispatch(changeAutoUpdateSettings(autoUpdate));
			}

			dispatch(setWidgets(widgets));
			dispatch(setWebLayouts(widgets, refresh, layouts));
			dispatch(setMobileLayouts(widgets, refresh, mobileLayouts));

			if (refresh) {
				widgets.forEach(widget => {
					dispatch(fetchBuildData(widget));
				});
			}
		});
	} catch (exception) {
		if (exception instanceof PersonalDashboardNotFound) {
			if (payload.isPersonal) {
				dispatch(setPersonalValue(false));
				dispatch(getSettings(refresh));
				return;
			}
		}

		throw exception;
	}
};

/**
 * Включает режим редактирования
 * @returns {ThunkAction}
 */
const editDashboard = (): ThunkAction => (dispatch: Dispatch) => {
	dispatch({
		type: 'dashboard/settings/switchOnEditMode'
	});

	dashboardResizer.resetHeight();
};

/**
 * Создает персональный дашборд
 * @returns {ThunkAction}
 */
const createPersonalDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		dispatch({
			type: 'dashboard/settings/createPersonalDashboard'
		});

		const {context} = getState();
		const {contentCode, dashboardMode, subjectUuid: classFqn, user} = context;

		await api.instance.dashboardSettings.personalDashboard.create(classFqn, contentCode, dashboardMode === DASHBOARD_EDIT_MODE.EDIT);

		dispatch(setUserData({...user, hasPersonalDashboard: true}));
		dispatch({
			type: 'dashboard/settings/createdPersonalDashboard'
		});
		dispatch(switchDashboard());
	} catch (e) {
		dispatch({
			type: 'dashboard/settings/errorCreatePersonalDashboard'
		});

		const errorMessage = e instanceof ApiError ? e.message : t('store::dashboard::settings::ErrorSavingPersonalDashboard');

		dispatch(createToast({
			text: errorMessage,
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
			type: 'dashboard/settings/deletePersonalDashboard'
		});

		const {context} = getState();
		const {contentCode, subjectUuid, user} = context;

		await api.instance.dashboardSettings.personalDashboard.delete(subjectUuid, contentCode);

		dispatch(switchDashboard(false));
		dispatch(setUserData({...user, hasPersonalDashboard: false}));
		dispatch(setPersonalValue(false));
		dispatch({
			type: 'dashboard/settings/deletedPersonalDashboard'
		});
	} catch (e) {
		dispatch({
			type: 'dashboard/settings/errorDeletePersonalDashboard'
		});

		const errorMessage = e instanceof ApiError ? e.message : t('store::dashboard::settings::DeleteError');

		dispatch(createToast({
			text: errorMessage,
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
	dispatch({type: 'dashboard/settings/switchOffEditMode'});
	dispatch(hideCopyPanel());
	dashboardResizer.resize();
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
		type: 'dashboard/settings/requestExportingFileToEmail'
	});

	try {
		const key = await uploadFile(file, name);

		await api.instance.fileToMail.send(key, type, name, users);

		dispatch({
			type: 'dashboard/settings/responseExportingFileToEmail'
		});

		dispatch(createToast({
			text: t('store::dashboard::settings::FileSentSuccessfully')
		}));
	} catch (e) {
		dispatch({
			type: 'dashboard/settings/recordExportingFileToEmailError'
		});

		const errorMessage = e instanceof ApiError ? e.message : t('store::dashboard::settings::FileSendingError');

		dispatch(createToast({
			text: errorMessage,
			type: 'error'
		}));
	}
};

/**
 * Получает настройки, сгенерированные с adv-листа и инициализирует добавление нового виджета с этими настройками.
 * @returns {ThunkAction}
 */
const getPassedWidget = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {context, dashboard, sources, widgetForms} = getState();
	const {contentCode} = context;
	const {metaClass} = await api.instance.frame.getCurrentContextObject();
	let descriptorStr = '';
	let foundKey;

	// Данные могут сохраняться как по типу так и по классу
	[
		`widgetContext_${metaClass}_${contentCode}`,
		`widgetContext_${metaClass.split('$')[0]}_${contentCode}`
	].every(key => {
		descriptorStr = localStorage.getItem(key) ?? '';
		foundKey = key;
		return !descriptorStr;
	});

	if (descriptorStr && foundKey) {
		const newWidget: Object = new NewWidget(dashboard.settings.layoutMode, WIDGET_TYPES.BAR);
		const classFqn = await getValueFromDescriptor(descriptorStr);
		const {label, value} = sources.data.map[classFqn].value;
		const {axisChartForm: values} = widgetForms;
		const newData = values.data.map((dataSet, i) => i === 0 ? ({
			...dataSet,
			source: {
				...dataSet.source,
				descriptor: descriptorStr,
				value: {
					label,
					value
				}
			}
		}) : dataSet);

		dashboardResizer.focus();

		dispatch(changeAxisChartFormValues({...values, data: newData}));
		dispatch(addLayouts(NewWidget.id));
		dispatch(addNewWidget(newWidget));
		dispatch(editDashboard());
		localStorage.removeItem(foundKey);
	}
};

/**
 * Добавляем первый виджет для дашбордов  userSource
 * @returns {ThunkAction}
 */
const updateUserSourceMode = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const state = getState();
	const {dashboard} = state;
	const isUserMode = isRestrictUserModeDashboard(state);
	const widgets = getAllWidgets(state);

	if (isUserMode && widgets.length === 0) {
		const newWidget: Object = new NewWidget(dashboard.settings.layoutMode, WIDGET_TYPES.COLUMN);

		dispatch(addLayouts(newWidget.id));
		dispatch(addNewWidget(newWidget));
		dispatch(editDashboard());
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
		const state = getState();
		const {context} = state;
		const {contentCode, subjectUuid: classFqn} = context;
		const autoUpdateSetting = {enabled, interval: Number(interval)};
		const isPersonal = isPersonalDashboard(state);
		const isForUser = isUserModeDashboard(state);
		const payload = {
			autoUpdate: autoUpdateSetting,
			classFqn,
			contentCode,
			isForUser,
			isPersonal
		};

		await api.instance.dashboardSettings.settings.saveAutoUpdate(payload);

		dispatch(changeAutoUpdateSettings(autoUpdateSetting));
		dispatch(createToast({
			text: t('store::dashboard::settings::SettingsSuccessfullyChanged')
		}));
	} catch (e) {
		const errorMessage = e instanceof ApiError ? e.message : t('store::dashboard::settings::ErrorSavingSettings');

		dispatch(createToast({
			text: errorMessage,
			type: 'error'
		}));
	}
};

/**
 * Создает состояние для дашборда
 * @returns {ThunkAction}
 * @param {boolean} personalDashboard - указывает является ли новое состояние, состоянием персонального дашборда
 */
const createNewState = (personalDashboard: boolean) => async (dispatch: Dispatch) => {
	dispatch({type: 'root/resetState'});
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
		type: 'dashboard/settings/changeLayoutMode'
	});
};

const setPersonalValue = (payload: boolean) => (dispatch: Dispatch) => {
	setLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.PERSONAL_DASHBOARD, payload);

	dispatch({
		payload,
		type: 'dashboard/settings/setPersonal'
	});
};

/**
 * Переключает дашборды с общего на персональный и обратно
 * @param {boolean} saveState - сообщает о необходимости сохранять состояние дашборда, с которого идет переключение.
 * Для дальнейшего использования при возврате обратно на дашборд.
 * @returns {ThunkAction}
 */
const switchDashboard = (saveState: boolean = true): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const state = getState();
	const {context, customGroups, dashboard, widgets} = state;
	const isPersonal = isPersonalDashboard(state);
	const {temp} = context;

	dispatch({
		type: CONTEXT_EVENTS.START_SWITCH
	});

	saveState ? dispatch(setTemp({customGroups, dashboard, widgets})) : dispatch(setTemp(null));

	try {
		if (temp) {
			dispatch({
				payload: temp,
				type: 'root/switchState'
			});
		} else {
			await dispatch(createNewState(!isPersonal));
		}
	} finally {
		dispatch({
			type: CONTEXT_EVENTS.END_SWITCH
		});
	}
};

const initLayoutMode = () => ({
	payload: getLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.LAYOUT_MODE),
	type: 'dashboard/settings/changeLayoutMode'
});

const initPersonalValue = () => ({
	payload: getLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.PERSONAL_DASHBOARD, false),
	type: 'dashboard/settings/setPersonal'
});

const initHeaderPanel = () => ({
	payload: getLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.SHOW_HEADER_PANEL, true),
	type: 'dashboard/settings/changeShowHeader'
});

const initEditPanelPosition = () => ({
	payload: getLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.EDIT_PANEL_POSITION, EDIT_PANEL_POSITION.RIGHT),
	type: 'dashboard/settings/setEditPanelPosition'
});

const changeAutoUpdateSettings = payload => ({
	payload,
	type: 'dashboard/settings/changeAutoUpdateSettings'
});

const setCode = payload => ({
	payload,
	type: 'dashboard/settings/setCode'
});

const setDashboardUUID = payload => ({
	payload,
	type: 'dashboard/settings/setDashboardUUID'
});

const setEditPanelPosition = (payload: EditPanelPosition) => (dispatch: Dispatch) => {
	setLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.EDIT_PANEL_POSITION, payload);
	dispatch({
		payload,
		type: 'dashboard/settings/setEditPanelPosition'
	});
};

const setHideEditPanel = (payload: boolean) => ({
	payload,
	type: 'dashboard/settings/setHideEditPanel'
});

/**
 * Включает/выключает панель копирования в панели редактирования
 * @param {boolean} payload - параметр сообщает включена или выключена панель копирования
 * @returns {SettingsAction} - возвращает действие включения/выключения панели копирования.
 */
const setShowCopyPanel = (payload: boolean) => ({
	payload,
	type: 'dashboard/settings/setShowCopyPanel'
});

/**
 * Включает панель копирования в панели редактирования
 * @returns {SettingsAction} - возвращает действие включения панели копирования.
 */
const showCopyPanel = () => setShowCopyPanel(true);

/**
 * Выключает панель копирования в панели редактирования
 * @returns {SettingsAction} - возвращает действие включения панели копирования.
 */
const hideCopyPanel = () => setShowCopyPanel(false);

const setWidthEditPanel = (payload: number) => ({
	payload,
	type: 'dashboard/settings/setWidthEditPanel'
});

const changeShowHeader = (payload: boolean) => async (dispatch: Dispatch) => {
	setLocalStorageValue(getUserLocalStorageId(), LOCAL_STORAGE_VARS.SHOW_HEADER_PANEL, payload);

	await dispatch({
		payload,
		type: 'dashboard/settings/changeShowHeader'
	});

	dashboardResizer.resetAndResize();
};

export {
	changeLayoutMode,
	changeShowHeader,
	createNewState,
	createPersonalDashboard,
	editDashboard,
	fetchDashboard,
	getSettings,
	hideCopyPanel,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToEmails,
	setEditPanelPosition,
	setHideEditPanel,
	setShowCopyPanel,
	setWidthEditPanel,
	showCopyPanel,
	switchDashboard,
	updateUserSourceMode
};
