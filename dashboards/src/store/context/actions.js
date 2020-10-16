// @flow
import {CONTEXT_EVENTS, USER_ROLES} from './constants';
import {createNewState, setEditable} from 'store/dashboard/settings/actions';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {switchState} from 'store/actions';
import type {UserData} from './types';

const getContext = (): ThunkAction => (dispatch: Dispatch) => {
	const {jsApi} = window;
	const contentCode = jsApi.findContentCode();
	const subjectUuid = jsApi.extractSubjectUuid();

	dispatch(setContext({contentCode, subjectUuid}));
};

const getMetaCLass = (): ThunkAction => async (dispatch: Dispatch) => {
	const {metaClass} = await window.jsApi.commands.getCurrentContextObject();
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
	} = await window.jsApi.restCallModule('dashboardSettings', 'getUserData', payload);

	if (role !== USER_ROLES.REGULAR) {
		dispatch(setEditable(true));
	}

	dispatch(setUserData({
		email,
		hasPersonalDashboard,
		name,
		role
	}));
};

/**
 * Переключает дашборды с общего на персональный и обратно
 * @returns {ThunkAction}
 */
const switchDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {context, customGroups, dashboard, widgets} = getState();
	const {temp} = context;

	dispatch(startSwitch());
	dispatch(setTemp({customGroups, dashboard, widgets}));

	if (temp) {
		dispatch(switchState(temp));
	} else {
		await dispatch(createNewState());
	}

	dispatch(endSwitch());
};

const endSwitch = () => ({
	type: CONTEXT_EVENTS.END_SWITCH
});

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

const startSwitch = () => ({
	type: CONTEXT_EVENTS.START_SWITCH
});

export {
	getContext,
	getMetaCLass,
	getUserData,
	setTemp,
	setUserData,
	switchDashboard
};
