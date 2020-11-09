// @flow
import type {CalendarSelectorsState} from './types';

export const initialState: CalendarSelectorsState = {
	calendarId: null,
	calendarList: [],
	error: null,
	isLoading: false,
	locationList: []
};
