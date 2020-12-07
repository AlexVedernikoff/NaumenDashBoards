// @flow
import type {
	Calendar,
	CalendarList,
	CalendarStatusFilterList,
	Location,
	LocationList
} from 'store/CalendarSelectors/types';
import {CALENDAR_SELECTORS_EVENTS} from 'store/CalendarSelectors/constants';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	calendarList: CalendarList,
	error: Error | null,
	isAppSelectorsLoading: boolean,
	locationList: LocationList,
	metaClass: string | null,
	selectedOptions: {
		calendar: Calendar | null,
		calendarStatusFilter: CalendarStatusFilterList,
		location: Location | null
	},
	subjectId: string | null
};

export type ConnectedFunctions = {
	getCalendarList: (locationId: string) => ThunkAction,
	getLocationList: () => ThunkAction,
	setSelectedOption: (
		fieldName: string,
		data: CalendarStatusFilterList | Calendar | Location | null
	) => {
		payload: {
			data: CalendarStatusFilterList | Calendar | Location | null,
			fieldName: string
		},
		type: typeof CALENDAR_SELECTORS_EVENTS.SET_SELECTED_OPTION
	}
};

export type Props = {
	// NOTE: По какой-то причине Flow не видит subjectId в ConnectedProps
	subjectId: string | null
} & ConnectedProps & ConnectedFunctions;
