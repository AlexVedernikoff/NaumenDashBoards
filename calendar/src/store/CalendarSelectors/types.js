// @flow
import {CALENDAR_SELECTORS_EVENTS} from './constants';
type SelectorRecord = {
	id: string,
	value: string
};

type Location = SelectorRecord;

type Calendar = SelectorRecord;

export type LocationList = Array<Location>;

export type CalendarList = Array<Calendar>;

export type CalendarSelectorsState = {
	calendarList: CalendarList,
	error: Error | null,
	isLoading: boolean,
	locationList: LocationList
};

export type ActionType = {
	payload: any,
	type: typeof CALENDAR_SELECTORS_EVENTS
};
