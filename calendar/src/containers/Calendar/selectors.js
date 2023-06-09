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
		app: {defaultView, isLoading: isAppLoading, hideWeekend},
		calendar: {calendarData, calendarResourceColorList, error, isLoading: isCalendarLoading},
		calendarSelectors: {selectedOptions}
	} = state;
	const {calendarStatusFilter, calendar} = selectedOptions;
	const calendarId = calendar
		? calendar.id
		: null;
	return {
		calendarData,
		calendarId,
		calendarResourceColorList,
		calendarStatusFilter,
		defaultView,
		error,
		hideWeekend,
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
