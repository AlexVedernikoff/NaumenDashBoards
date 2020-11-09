// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {
	getCalendarList,
	getLocationList,
	setCalendar
} from 'store/CalendarSelectors/actions';
import type {State} from 'store/types';

export const props = (state: State): ConnectedProps => {
	const {
		calendarSelectors: {
			calendarId,
			calendarList,
			error,
			isLoading,
			locationList
		}
	} = state;
	return {
		calendarId,
		calendarList,
		error,
		isLoading,
		locationList
	};
};

export const functions: ConnectedFunctions = {
	getCalendarList,
	getLocationList,
	setCalendar
};
