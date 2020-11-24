// @flow
import {CALENDAR_SELECTORS_EVENTS} from './constants';
type SelectorRecord = {
	id: string,
	value: string
};

export type Location = SelectorRecord;

export type Calendar = SelectorRecord;

export type LocationList = Array<Location>;

export type CalendarList = Array<Calendar>;

export type CalendarSelectorsState = {
	calendarList: CalendarList,
	error: Error | null,
	isLoading: boolean,
	locationList: LocationList,
	selectedOptions: {
		calendar: Calendar | null,
		location: Location | null
	}
};

export type ActionType = {
	payload: any,
	type: typeof CALENDAR_SELECTORS_EVENTS
};
