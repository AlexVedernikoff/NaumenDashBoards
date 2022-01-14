// @flow
import api from 'api';
import {CONTEXT_EVENTS, DASHBOARD_EDIT_MODE} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {UserData} from './types';

/**
 * Получает и устанавливает параметр редактируемости дашборда
 * @returns {ThunkAction}
 */
const getEditableParam = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {editable = [DASHBOARD_EDIT_MODE.EDIT]} = await api.instance.frame.getCurrentContentParameters();
	let mode;

	// Версии 2.1+
	if (Array.isArray(editable)) {
		mode = editable[0];
	} else {
		// версия до 2.1. В части случаев значение приходит строкой
		mode = editable.toString() === 'true' ? DASHBOARD_EDIT_MODE.EDIT : DASHBOARD_EDIT_MODE.VIEW_ONLY;
	}

	if (mode === DASHBOARD_EDIT_MODE.USER || mode === DASHBOARD_EDIT_MODE.USER_SOURCE) {
		api.reconfigure({
			driver: process.env.API_DRIVER?.endsWith('-dev') ? 'userExec-dev' : 'userExec'
		});
	}

	dispatch({
		payload: mode,
		type: CONTEXT_EVENTS.SET_DASHBOARD_EDIT_MODE
	});
};

const getContext = (): ThunkAction => (dispatch: Dispatch) => {
	const contentCode = api.instance.frame.getContentCode();
	const subjectUuid = api.instance.frame.getSubjectUuid();

	dispatch(setContext({contentCode, subjectUuid}));
};

const getMetaClass = (): ThunkAction => async (dispatch: Dispatch) => {
	const {metaClass} = await api.instance.frame.getCurrentContextObject();

	dispatch(setContext({metaClass}));
};

const getUserData = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {contentCode, subjectUuid: classFqn} = getState().context;
	const payload = {
		classFqn,
		contentCode
	};

	const {
		email,
		groupUser: role,
		hasPersonalDashboard,
		name
	} = await api.instance.dashboardSettings.settings.getUserData(payload);

	dispatch(setUserData({
		email,
		hasPersonalDashboard,
		name,
		role
	}));
};

const setContext = payload => ({
	payload,
	type: CONTEXT_EVENTS.SET_CONTEXT
});

const setUserData = (payload: UserData) => ({
	payload,
	type: CONTEXT_EVENTS.SET_USER_DATA
});

const setTemp = (payload: Object | null) => ({
	payload,
	type: CONTEXT_EVENTS.SET_TEMP
});

export {
	getContext,
	getEditableParam,
	getMetaClass,
	getUserData,
	setTemp,
	setUserData
};
