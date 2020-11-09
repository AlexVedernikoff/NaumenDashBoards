// @flow
import type {CalendarList, LocationList} from 'store/CalendarSelectors/types';
import {CALENDAR_SELECTORS_EVENTS} from 'store/CalendarSelectors/constants';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	calendarId: string | null,
	calendarList: CalendarList,
	error: Error | null,
	isLoading: boolean,
	locationList: LocationList
};

export type ConnectedFunctions = {
	getCalendarList: (locationId: string) => ThunkAction,
	getLocationList: () => ThunkAction,
	setCalendar: (
		calendarId: string | null
	) => {
		payload: string | null,
		type: typeof CALENDAR_SELECTORS_EVENTS.SET_CALENDAR
	}
};

export type Props = ConnectedProps & ConnectedFunctions;
