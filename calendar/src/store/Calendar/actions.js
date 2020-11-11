// @flow
import type {
	CalendarApiData,
	CalendarData,
	GetCalendarDataParams,
	ResourceColor
} from './types';
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
		const normalizedData: Array<CalendarData> = data.map(
			({end, start, link, description, type}) => ({
				end: new Date(end),
				id: link,
				start: new Date(start),
				title: description,
				type
			})
		);
		dispatch(setCalendarData(normalizedData));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(setCalendarLoading(false));
	}
};

/**
 * Получает список всех возможных типов событий с их цветом
 * @returns {ThunkAction}
 */
const getCalendarResourceColorList = (): ThunkAction => async (dispatch: Dispatch) => {
	dispatch(setCalendarResourceColorListLoading(true));
	try {
		const data: Array<ResourceColor> = await window.jsApi.restCallModule(
			'calendarController',
			'getEventStatesColors'
		);
		dispatch(setCalendarResourceColorList(data));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(setCalendarResourceColorListLoading(false));
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

const setCalendarResourceColorList = (payload: Array<ResourceColor>) => ({
	payload,
	type: CALENDAR_EVENTS.SET_CALENDAR_RESOURCE_COLOR_LIST
});

const setCalendarResourceColorListLoading = (payload: boolean) => ({
	payload,
	type: CALENDAR_EVENTS.SET_CALENDAR_RESOURCE_COLOR_LIST_LOADING
});

export {
	getCalendarData,
	getCalendarResourceColorList,
	setCalendarData,
	setCalendarLoading,
	setCalendarResourceColorList,
	setCalendarResourceColorListLoading,
	setError
};
