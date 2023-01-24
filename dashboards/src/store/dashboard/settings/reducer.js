// @flow
import dashboardResizer from 'utils/dashboardResizer';
import {defaultDashboardAction, initialDashboardState} from './init';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {SettingsAction, SettingsState} from './types';

const reducer = (state: SettingsState = initialDashboardState, action: SettingsAction = defaultDashboardAction): SettingsState => {
	switch (action.type) {
		case 'dashboard/settings/changeAutoUpdateSettings':
			return {
				...state,
				autoUpdate: {...state.autoUpdate, ...action.payload}
			};
		case 'dashboard/settings/changeLayoutMode':
			return {
				...state,
				layoutMode: state.isMobileDevice ? LAYOUT_MODE.MOBILE : action.payload ?? LAYOUT_MODE.WEB
			};
		case 'dashboard/settings/changeShowHeader':
			dashboardResizer.setShowHeader(action.payload);
			return {
				...state,
				showHeader: action.payload
			};
		case 'dashboard/settings/createPersonalDashboard':
			return {
				...state,
				personalCreating: true
			};
		case 'dashboard/settings/createdPersonalDashboard':
			return {
				...state,
				personalCreating: false
			};
		case 'dashboard/settings/deletePersonalDashboard':
			return {
				...state,
				personalDeleting: true
			};
		case 'dashboard/settings/deletedPersonalDashboard':
			return {
				...state,
				personalDeleting: false
			};
		case 'dashboard/settings/errorCreatePersonalDashboard':
			return {
				...state,
				personalCreating: false
			};
		case 'dashboard/settings/errorDeletePersonalDashboard':
			return {
				...state,
				personalDeleting: false
			};
		case 'dashboard/settings/receiveDashboard':
			return {
				...state,
				error: null,
				loading: false
			};
		case 'dashboard/settings/recordDashboardError':
			return {
				...state,
				error: action.payload,
				loading: false
			};
		case 'dashboard/settings/recordExportingFileToEmailError':
			return {
				...state,
				exportingFailToEmail: {
					...state.exportingFailToEmail,
					error: true,
					loading: false
				}
			};
		case 'dashboard/settings/requestDashboard':
			return {
				...state,
				error: null,
				loading: true
			};
		case 'dashboard/settings/requestExportingFileToEmail':
			return {
				...state,
				exportingFailToEmail: {
					...state.exportingFailToEmail,
					error: false,
					loading: true
				}
			};
		case 'dashboard/settings/responseExportingFileToEmail':
			return {
				...state,
				exportingFailToEmail: {
					...state.exportingFailToEmail,
					loading: false
				}
			};
		case 'dashboard/settings/setCode':
			return {
				...state,
				code: action.payload
			};
		case 'dashboard/settings/setDashboardUUID':
			return {
				...state,
				dashboardUUID: action.payload
			};
		case 'dashboard/settings/setEditPanelPosition':
			return {
				...state,
				editPanelPosition: action.payload
			};
		case 'dashboard/settings/setHideEditPanel':
			return {
				...state,
				hideEditPanel: action.payload
			};
		case 'dashboard/settings/setShowCopyPanel':
			return {
				...state,
				showCopyPanel: action.payload
			};
		case 'dashboard/settings/setPersonal':
			return {
				...state,
				personal: action.payload
			};
		case 'dashboard/settings/setWidthEditPanel':
			return {
				...state,
				widthEditPanel: action.payload
			};
		case 'dashboard/settings/switchOnEditMode':
			return {
				...state,
				editMode: true,
				hideEditPanel: false
			};
		case 'dashboard/settings/switchOffEditMode':
			return {
				...state,
				editMode: false
			};
		default:
			return state;
	}
};

export default reducer;
