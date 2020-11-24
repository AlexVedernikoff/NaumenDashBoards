// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {
	getCalendarData,
	getCalendarResourceColorList,
	openEventLink,
	setCalendarData
} from 'store/Calendar/actions';
import type {State} from 'store/types';

export const props = (state: State): ConnectedProps => {
	const {
		app: {defaultView, isLoading: isAppLoading},
		calendar: {calendarData, calendarResourceColorList, error, isLoading: isCalendarLoading},
		calendarSelectors: {selectedOptions}
	} = state;
	const calendarId = selectedOptions.calendar
		? selectedOptions.calendar.id
		: null;
	return {
		calendarData,
		calendarId,
		calendarResourceColorList,
		defaultView,
		error,
		isAppLoading,
		isCalendarLoading
	};
};

export const functions: ConnectedFunctions = {
	getCalendarData,
	getCalendarResourceColorList,
	openEventLink,
	setCalendarData
};
