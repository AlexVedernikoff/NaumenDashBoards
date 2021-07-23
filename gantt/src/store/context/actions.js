// @flow
import {CONTEXT_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {UserData} from './types';

/**
 * Получает и устанавливает параметер редактируемости дашборда
 * @returns {ThunkAction}
 */
const getEditableParam = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {editable = true} = await window.jsApi.commands.getCurrentContentParameters();

	dispatch({
		// В части случаев значение приходит строкой
		payload: editable.toString() === 'true',
		type: CONTEXT_EVENTS.SET_EDITABLE_PARAM
	});
};

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
	getMetaCLass,
	getUserData,
	setTemp,
	setUserData
};
