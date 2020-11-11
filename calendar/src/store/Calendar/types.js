// @flow
import {CALENDAR_EVENTS} from './constants';

export type ResourceColor = {
	color: string | null,
	value: string
};
export type CalendarData = {
	end: Date,
	id: string,
	start: Date,
	title: string,
	type: string
};

export type CalendarApiData = {
	description: string,
	end: string,
	link: string,
	start: string,
	type: string
};

export type CalendarState = {
	+calendarData: Array<CalendarData>,
	+calendarResourceColorList: Array<ResourceColor>,
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

export type ISetCalendarResourceColorList = {
	payload: Array<ResourceColor>,
	type: typeof CALENDAR_EVENTS.SET_CALENDAR_RESOURCE_COLOR_LIST
};

export type ISetCalendarResourceColorListLoading = {
	payload: boolean,
	type: typeof CALENDAR_EVENTS.SET_CALENDAR_RESOURCE_COLOR_LIST_LOADING
};

export type ActionType =
	| ISetCalendarData
	| ISetCalendarLoading
	| ISetCalendarResourceColorList
	| ISetCalendarResourceColorListLoading
	| ISetError;
