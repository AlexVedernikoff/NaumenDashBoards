// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {
	getCalendarData,
	getCalendarResourceColorList,
	setCalendarData
} from 'store/Calendar/actions';
import type {State} from 'store/types';

export const props = (state: State): ConnectedProps => {
	const {
		calendar: {calendarData, calendarResourceColorList, error, isLoading},
		calendarSelectors: {calendarId}
	} = state;
	return {
		calendarData,
		calendarId,
		calendarResourceColorList,
		error,
		isLoading
	};
};

export const functions: ConnectedFunctions = {
	getCalendarData,
	getCalendarResourceColorList,
	setCalendarData
};
