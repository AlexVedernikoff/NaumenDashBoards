// @flow
import type {CalendarList, LocationList} from './types';
import type {Dispatch, ThunkAction} from 'store/types';
import {CALENDAR_SELECTORS_EVENTS} from './constants';

/**
 * Получает список всех доступных календарей для данной локации
 * @param {string} id - id выбранной локации
 * @returns {ThunkAction}
 */
const getCalendarList = (id: string): ThunkAction => async (
	dispatch: Dispatch
) => {
	dispatch(setCalendarListLoading(true));
	try {
		const data = await window.jsApi.restCallModule(
			'dashboardCalendar',
			'fieldCalendar',
			id
		);
		dispatch(setCalendarList(data));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(setCalendarListLoading(false));
	}
};

/**
 * Получает список всех доступных локаций
 * @returns {ThunkAction}
 */
const getLocationList = (): ThunkAction => async (dispatch: Dispatch) => {
	dispatch(setLocationListLoading(true));
	try {
		const data = await window.jsApi.restCallModule(
			'dashboardCalendar',
			'fieldLocation'
		);
		dispatch(setLocationList(data));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(setLocationListLoading(false));
	}
};

const setCalendarListLoading = (payload: boolean) => ({
	payload,
	type: CALENDAR_SELECTORS_EVENTS.SET_CALENDAR_LIST_LOADING
});

const setCalendarList = (payload: CalendarList) => ({
	payload,
	type: CALENDAR_SELECTORS_EVENTS.SET_CALENDAR_LIST
});

const setLocationListLoading = (payload: boolean) => ({
	payload,
	type: CALENDAR_SELECTORS_EVENTS.SET_LOCATION_LIST_LOADING
});

const setLocationList = (payload: LocationList) => ({
	payload,
	type: CALENDAR_SELECTORS_EVENTS.SET_LOCATION_LIST
});

const setError = (payload: Error) => ({
	payload,
	type: CALENDAR_SELECTORS_EVENTS.SET_ERROR
});

export {getCalendarList, getLocationList};
