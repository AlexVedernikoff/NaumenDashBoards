// @flow
import type {CalendarSelectorsState} from './types';

export const initialState: CalendarSelectorsState = {
	calendarList: [],
	error: null,
	isLoading: true,
	locationList: [],
	selectedOptions: {
		calendar: null,
		calendarStatusFilter: [],
		location: null
	}
};
