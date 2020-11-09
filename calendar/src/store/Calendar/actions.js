// @flow
import type {CalendarApiData, CalendarData, GetCalendarDataParams} from './types';
import type {Dispatch, ThunkAction} from 'store/types';
import {CALENDAR_EVENTS} from './constants';

/**
 * Получает список всех событий календаря для данных параметров
 * @param {GetCalendarDataParams} params - параметры
 * @returns {ThunkAction}
 */
const getCalendarData = (params: GetCalendarDataParams): ThunkAction => async (
	dispatch: Dispatch
) => {
	dispatch(setCalendarLoading(true));
	try {
		const {calendarId, dateFrom, dateTo} = params;
		const data: Array<CalendarApiData> = await window.jsApi.restCallModule(
			'calendarController',
			'getEvents',
			calendarId,
			dateFrom,
			dateTo
		);
		const normalizedData: Array<CalendarData> = data.map(({end, start, link, color, description}) => ({
			color,
			end: new Date(end),
			id: link,
			start: new Date(start),
			title: description
		}));
		dispatch(setCalendarData(normalizedData));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(setCalendarLoading(false));
	}
};

const setCalendarLoading = (payload: boolean) => ({
	payload,
	type: CALENDAR_EVENTS.SET_CALENDAR_DATA_LOADING
});

const setCalendarData = (payload: Array<CalendarData>) => ({
	payload,
	type: CALENDAR_EVENTS.SET_CALENDAR_DATA
});

const setError = (payload: Error) => ({
	payload,
	type: CALENDAR_EVENTS.SET_ERROR
});

export {
	getCalendarData,
	setCalendarLoading,
	setCalendarData,
	setError
};
