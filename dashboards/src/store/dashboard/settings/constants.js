// @flow
const CHANGE_AUTO_UPDATE_SETTINGS: 'CHANGE_AUTO_UPDATE_SETTINGS' = 'CHANGE_AUTO_UPDATE_SETTINGS';
const CHANGE_INTERVAL_REMINDER: 'CHANGE_INTERVAL_REMINDER' = 'CHANGE_INTERVAL_REMINDER';
const CHANGE_LAYOUT_MODE: 'CHANGE_LAYOUT_MODE' = 'CHANGE_LAYOUT_MODE';
const CREATE_PERSONAL_DASHBOARD: 'CREATE_PERSONAL_DASHBOARD' = 'CREATE_PERSONAL_DASHBOARD';
const CREATED_PERSONAL_DASHBOARD: 'CREATED_PERSONAL_DASHBOARD' = 'CREATED_PERSONAL_DASHBOARD';
const DELETE_PERSONAL_DASHBOARD: 'DELETE_PERSONAL_DASHBOARD' = 'DELETE_PERSONAL_DASHBOARD';
const DELETED_PERSONAL_DASHBOARD: 'DELETED_PERSONAL_DASHBOARD' = 'DELETED_PERSONAL_DASHBOARD';
const ERROR_CREATE_PERSONAL_DASHBOARD: 'CREATE_PERSONAL_DASHBOARD' = 'CREATE_PERSONAL_DASHBOARD';
const ERROR_DELETE_PERSONAL_DASHBOARD: 'ERROR_DELETE_PERSONAL_DASHBOARD' = 'ERROR_DELETE_PERSONAL_DASHBOARD';
const RECEIVE_DASHBOARD: 'RECEIVE_DASHBOARD' = 'RECEIVE_DASHBOARD';
const RECORD_DASHBOARD_ERROR: 'RECORD_DASHBOARD_ERROR' = 'RECORD_DASHBOARD_ERROR';
const RECORD_EXPORTING_FILE_TO_EMAIL_ERROR: 'RECORD_EXPORTING_FILE_TO_EMAIL_ERROR' = 'RECORD_EXPORTING_FILE_TO_EMAIL_ERROR';
const REQUEST_DASHBOARD: 'REQUEST_DASHBOARD' = 'REQUEST_DASHBOARD';
const REQUEST_EXPORTING_FILE_TO_EMAIL: 'REQUEST_EXPORTING_FILE_TO_EMAIL' = 'REQUEST_EXPORTING_FILE_TO_EMAIL';
const RESPONSE_EXPORTING_FILE_TO_EMAIL: 'RESPONSE_EXPORTING_FILE_TO_EMAIL' = 'RESPONSE_EXPORTING_FILE_TO_EMAIL';
const SET_CODE: 'SET_CODE' = 'SET_CODE';
const SET_DASHBOARD_UUID: 'SET_DASHBOARD_UUID' = 'SET_DASHBOARD_UUID';
const SET_HIDE_EDIT_PANEL: 'SET_HIDE_EDIT_PANEL' = 'SET_HIDE_EDIT_PANEL';
const SET_PERSONAL: 'SET_PERSONAL' = 'SET_PERSONAL';
const SWITCH_OFF_EDIT_MODE: 'SWITCH_OFF_EDIT_MODE' = 'SWITCH_OFF_EDIT_MODE';
const SWITCH_ON_EDIT_MODE: 'SWITCH_ON_EDIT_MODE' = 'SWITCH_ON_EDIT_MODE';
const UNKNOWN_DASHBOARD_ACTION: 'UNKNOWN_DASHBOARD_ACTION' = 'UNKNOWN_DASHBOARD_ACTION';

const DASHBOARD_EVENTS = {
	CHANGE_AUTO_UPDATE_SETTINGS,
	CHANGE_INTERVAL_REMINDER,
	CHANGE_LAYOUT_MODE,
	CREATED_PERSONAL_DASHBOARD,
	CREATE_PERSONAL_DASHBOARD,
	DELETED_PERSONAL_DASHBOARD,
	DELETE_PERSONAL_DASHBOARD,
	ERROR_CREATE_PERSONAL_DASHBOARD,
	ERROR_DELETE_PERSONAL_DASHBOARD,
	RECEIVE_DASHBOARD,
	RECORD_DASHBOARD_ERROR,
	RECORD_EXPORTING_FILE_TO_EMAIL_ERROR,
	REQUEST_DASHBOARD,
	REQUEST_EXPORTING_FILE_TO_EMAIL,
	RESPONSE_EXPORTING_FILE_TO_EMAIL,
	SET_CODE,
	SET_DASHBOARD_UUID,
	SET_HIDE_EDIT_PANEL,
	SET_PERSONAL,
	SWITCH_OFF_EDIT_MODE,
	SWITCH_ON_EDIT_MODE,
	UNKNOWN_DASHBOARD_ACTION
};

const DEFAULT_INTERVAL = 15;

// Режимы отображения сетки
const MOBILE: 'MOBILE' = 'MOBILE';
const WEB: 'WEB' = 'WEB';

const LAYOUT_MODE = {
	MOBILE,
	WEB
};

// контрольные точки отображения сетки
const LG: 'lg' = 'lg';
const SM: 'sm' = 'sm';

const LAYOUT_BREAKPOINTS = {
	LG,
	SM
};

const FETCH_DASHBOARD_ERROR_TEXT = 'Ошибка загрузки дашборда';

export {
	DASHBOARD_EVENTS,
	DEFAULT_INTERVAL,
	FETCH_DASHBOARD_ERROR_TEXT,
	LAYOUT_BREAKPOINTS,
	LAYOUT_MODE
};
