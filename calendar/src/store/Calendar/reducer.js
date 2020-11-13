// @flow
import type {ActionType, CalendarState} from './types';
import {CALENDAR_EVENTS} from './constants';
import {initialState} from './init';

const reducer = (
	state: CalendarState = initialState,
	{payload, type}: ActionType
) => {
	switch (type) {
		case CALENDAR_EVENTS.SET_CALENDAR_DATA:
			return {
				...state,
				calendarData: payload
			};
		case CALENDAR_EVENTS.SET_CALENDAR_DATA_LOADING:
			return {
				...state,
				// NOTE: удаляем старые данные, если начинается загрузка, чтоб они не "прыгали" при переключении месяца
				calendarData: payload === true ? [] : state.calendarData,
				isLoading: payload
			};
		case CALENDAR_EVENTS.SET_CALENDAR_RESOURCE_COLOR_LIST:
			return {
				...state,
				calendarResourceColorList: payload
			};
		case CALENDAR_EVENTS.SET_CALENDAR_RESOURCE_COLOR_LIST_LOADING:
			return {
				...state,
				isLoading: payload
			};
		case CALENDAR_EVENTS.SET_ERROR:
			return {
				...state,
				error: payload
			};
		default:
			return state;
	}
};

export default reducer;
