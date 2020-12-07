// @flow
import type {
	CalendarApiData,
	CalendarData,
	GetCalendarDataParams,
	Link,
	ResourceColor
} from './types';
import type {Dispatch, ThunkAction} from 'store/types';
import {CALENDAR_EVENTS} from './constants';
import {batch} from 'react-redux';

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
		const {calendarId, calendarStatusFilter, dateFrom, dateTo} = params;
		const {uuid} = window.jsApi.getCurrentUser();
		const normalizedCalendarStatusFilter = calendarStatusFilter.map(({id}) => id);
		const data: Array<CalendarApiData> = await window.jsApi.restCallModule(
			'calendarController',
			'getEvents',
			calendarId,
			dateFrom,
			dateTo,
			normalizedCalendarStatusFilter,
			uuid
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
		batch(() => {
			dispatch(setCalendarData(normalizedData));
			dispatch(setCalendarLoading(false));
		});
	} catch (error) {
		batch(() => {
			dispatch(setError(error));
			dispatch(setCalendarLoading(false));
		});
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

/**
 * Открывает в новой вкладке ссылку на событие
 * @param {string} linkId - id события
 * @returns {void | ThunkAction}
 */
const openEventLink = (linkId: string): void | ThunkAction => async (dispatch: Dispatch) => {
	try {
		const data: Link = await window.jsApi.restCallModule(
			'calendarController',
			'getObjectLink',
			linkId
		);

		window.open(data.link, '_blank');
	} catch (error) {
		dispatch(setError(error));
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
	openEventLink,
	setCalendarData,
	setCalendarLoading,
	setCalendarResourceColorList,
	setCalendarResourceColorListLoading,
	setError
};
