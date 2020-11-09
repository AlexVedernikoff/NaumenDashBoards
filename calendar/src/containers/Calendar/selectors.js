// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getCalendarData, setCalendarData} from 'store/Calendar/actions';
import type {State} from 'store/types';

export const props = (state: State): ConnectedProps => {
	const {
		calendar: {calendarData, error, isLoading},
		calendarSelectors: {calendarId}
	} = state;
	return {
		calendarData,
		calendarId,
		error,
		isLoading
	};
};

export const functions: ConnectedFunctions = {
	getCalendarData,
	setCalendarData
};
