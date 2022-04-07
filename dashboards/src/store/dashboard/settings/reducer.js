// @flow
import {DASHBOARD_EVENTS} from './constants';
import {defaultDashboardAction, initialDashboardState} from './init';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import {resizer as dashboardResizer} from 'app.constants';
import type {SettingsAction, SettingsState} from './types';

const reducer = (state: SettingsState = initialDashboardState, action: SettingsAction = defaultDashboardAction): SettingsState => {
	switch (action.type) {
		case DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS:
			return {
				...state,
				autoUpdate: {...state.autoUpdate, ...action.payload}
			};
		case DASHBOARD_EVENTS.CHANGE_INTERVAL_REMINDER:
			return {
				...state,
				autoUpdate: {...state.autoUpdate, remainder: action.payload}
			};
		case DASHBOARD_EVENTS.CHANGE_LAYOUT_MODE:
			return {
				...state,
				layoutMode: state.isMobileDevice ? LAYOUT_MODE.MOBILE : action.payload ?? LAYOUT_MODE.WEB
			};
		case DASHBOARD_EVENTS.CHANGE_SHOW_HEADER:
			dashboardResizer.setShowHeader(action.payload);
			return {
				...state,
				showHeader: action.payload
			};
		case DASHBOARD_EVENTS.CREATE_PERSONAL_DASHBOARD:
			return {
				...state,
				personalCreating: true
			};
		case DASHBOARD_EVENTS.CREATED_PERSONAL_DASHBOARD:
			return {
				...state,
				personalCreating: false
			};
		case DASHBOARD_EVENTS.DELETE_PERSONAL_DASHBOARD:
			return {
				...state,
				personalDeleting: true
			};
		case DASHBOARD_EVENTS.DELETED_PERSONAL_DASHBOARD:
			return {
				...state,
				personalDeleting: false
			};
		case DASHBOARD_EVENTS.ERROR_CREATE_PERSONAL_DASHBOARD:
			return {
				...state,
				personalCreating: false
			};
		case DASHBOARD_EVENTS.ERROR_DELETE_PERSONAL_DASHBOARD:
			return {
				...state,
				personalDeleting: false
			};
		case DASHBOARD_EVENTS.RECEIVE_DASHBOARD:
			return {
				...state,
				error: null,
				loading: false
			};
		case DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false
			};
		case DASHBOARD_EVENTS.RECORD_EXPORTING_FILE_TO_EMAIL_ERROR:
			return {
				...state,
				exportingFailToEmail: {
					...state.exportingFailToEmail,
					error: true,
					loading: false
				}
			};
		case DASHBOARD_EVENTS.REQUEST_DASHBOARD:
			return {
				...state,
				error: null,
				loading: true
			};
		case DASHBOARD_EVENTS.REQUEST_EXPORTING_FILE_TO_EMAIL:
			return {
				...state,
				exportingFailToEmail: {
					...state.exportingFailToEmail,
					error: false,
					loading: true
				}
			};
		case DASHBOARD_EVENTS.RESPONSE_EXPORTING_FILE_TO_EMAIL:
			return {
				...state,
				exportingFailToEmail: {
					...state.exportingFailToEmail,
					loading: false
				}
			};
		case DASHBOARD_EVENTS.SET_CODE:
			return {
				...state,
				code: action.payload
			};
		case DASHBOARD_EVENTS.SET_DASHBOARD_UUID:
			return {
				...state,
				dashboardUUID: action.payload
			};
		case DASHBOARD_EVENTS.SET_EDIT_PANEL_POSITION:
			return {
				...state,
				editPanelPosition: action.payload
			};
		case DASHBOARD_EVENTS.SET_HIDE_EDIT_PANEL:
			return {
				...state,
				hideEditPanel: action.payload
			};
		case DASHBOARD_EVENTS.SET_PERSONAL:
			return {
				...state,
				personal: action.payload
			};
		case DASHBOARD_EVENTS.SET_WIDTH_EDIT_PANEL:
			return {
				...state,
				widthEditPanel: action.payload
			};
		case DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE:
			return {
				...state,
				editMode: true,
				hideEditPanel: false
			};
		case DASHBOARD_EVENTS.SWITCH_OFF_EDIT_MODE:
			return {
				...state,
				editMode: false
			};
		default:
			return state;
	}
};

export default reducer;
