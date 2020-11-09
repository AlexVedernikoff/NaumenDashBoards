// @flow
import {CALENDAR_EVENTS} from './constants';

export type CalendarData = {
	color: string,
	end: Date,
	id: string,
	start: Date,
	title: string
};

export type CalendarApiData = {
	color: string,
	description: string,
	end: string,
	link: string,
	start: string
};

export type CalendarState = {
	+calendarData: Array<CalendarData>,
	+error: Error | null,
	+isLoading: boolean
};

export type GetCalendarDataParams = {
	calendarId: string,
	dateFrom: Date,
	dateTo: Date
};

export type ISetCalendarLoading = {
	payload: boolean,
	type: typeof CALENDAR_EVENTS.SET_CALENDAR_DATA_LOADING
};

export type ISetError = {
	payload: Error,
	type: typeof CALENDAR_EVENTS.SET_ERROR
};

export type ISetCalendarData = {
	payload: Array<CalendarData>,
	type: typeof CALENDAR_EVENTS.SET_CALENDAR_DATA
};

export type ActionType = ISetCalendarData | ISetError | ISetCalendarLoading;
