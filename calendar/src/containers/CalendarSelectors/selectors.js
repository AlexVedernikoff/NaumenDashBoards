// @flow
import type {ConnectedProps} from './types';
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
