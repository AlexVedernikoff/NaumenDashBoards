// @flow
import type {CalendarSelectorsState} from './types';

export const initialState: CalendarSelectorsState = {
	calendarList: [],
	error: null,
	isLoading: true,
	locationList: [],
	selectedOptions: {
		appointmentsDisabled: false,
		calendar: null,
		location: null
	}
};
