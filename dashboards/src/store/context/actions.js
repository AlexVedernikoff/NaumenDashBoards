// @flow
import {CONTEXT_EVENTS} from './constants';
import {createNewState} from 'store/dashboard/settings/actions';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {switchState} from 'store/actions';
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

/**
 * Переключает дашборды с общего на персональный и обратно
 * @param {boolean} savePrevState - параметр сообщает, нужно ли сохранять предыдущее состояние дашборда
 * @returns {ThunkAction}
 */
const switchDashboard = (savePrevState: boolean = true): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {context, customGroups, dashboard, widgets} = getState();
	const {personal: personalDashboard} = dashboard.settings;
	const {temp} = context;

	dispatch(startSwitch());

	savePrevState ? dispatch(setTemp({customGroups, dashboard, widgets})) : dispatch(setTemp(null));

	try {
		if (temp) {
			dispatch(switchState(temp));
		} else {
			await dispatch(createNewState(!personalDashboard));
		}
	} finally {
		dispatch(endSwitch());
	}
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
	getEditableParam,
	getMetaCLass,
	getUserData,
	setTemp,
	setUserData,
	switchDashboard
};
