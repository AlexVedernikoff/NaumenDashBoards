// @flow
import {buildUrl, client} from 'utils/api';
import {CONTEXT_EVENTS, USER_ROLES} from './constants';
import {createPersonalState, setEditable} from 'store/dashboard/actions';
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
	const url = buildUrl('dashboardSettings', 'getUserData', 'requestContent,user');
	const params = {
		classFqn,
		contentCode
	};
	const result = await client.post(url, params);

	const {data: {
		groupUser: role,
		hasPersonalDashboard
	}} = result;

	if (role !== USER_ROLES.REGULAR) {
		dispatch(setEditable(true));
	}

	dispatch(setUserData({
		hasPersonalDashboard,
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
		await dispatch(createPersonalState());
	}

	dispatch(endSwitch());
};

const endSwitch = () => ({
	type: CONTEXT_EVENTS.END_SWITCH
});

const setContext = payload => ({
	type: CONTEXT_EVENTS.SET_CONTEXT,
	payload
});

const setUserData = (payload: UserData) => ({
	type: CONTEXT_EVENTS.SET_USER_DATA,
	payload
});

const setTemp = (payload: Object | null) => ({
	type: CONTEXT_EVENTS.SET_TEMP,
	payload
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
