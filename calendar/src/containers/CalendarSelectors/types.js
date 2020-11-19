// @flow
import type {CalendarList, LocationList} from 'store/CalendarSelectors/types';
import {CALENDAR_SELECTORS_EVENTS} from 'store/CalendarSelectors/constants';
import type {InitParams} from 'utils/types';
import type {ThunkAction} from 'store/types';

type OwnProps = {
	initParams: InitParams
};

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

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
