// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getCalendarList, getLocationList} from 'store/CalendarSelectors/actions';
import type {State} from 'store/types';

export const props = (state: State): ConnectedProps => {
	const {
		calendarSelectors: {locationList, calendarList, isLoading, error}
	} = state;
	return {
		calendarList,
		error,
		isLoading,
		locationList
	};
};

export const functions: ConnectedFunctions = {
	getCalendarList,
	getLocationList
};
