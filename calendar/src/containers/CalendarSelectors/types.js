// @flow
import type {CalendarList, LocationList} from 'store/CalendarSelectors/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	calendarList: CalendarList,
	error: Error | null,
	isLoading: boolean,
	locationList: LocationList
};

export type ConnectedFunctions = {
	getCalendarList: (locationId: string) => ThunkAction,
	getLocationList: () => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
