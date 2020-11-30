// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {
	getCalendarList,
	getLocationList,
	setSelectedOption
} from 'store/CalendarSelectors/actions';
import type {State} from 'store/types';

export const props = (state: State): ConnectedProps => {
	const {
		calendarSelectors: {
			calendarList,
			error,
			locationList,
			selectedOptions
		},
		app: {metaClass, subjectId, isLoading: isAppSelectorsLoading}
	} = state;
	return {
		calendarList,
		error,
		isAppSelectorsLoading,
		locationList,
		metaClass,
		selectedOptions,
		subjectId
	};
};

export const functions: ConnectedFunctions = {
	getCalendarList,
	getLocationList,
	setSelectedOption
};
