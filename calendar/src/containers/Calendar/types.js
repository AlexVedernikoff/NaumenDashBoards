// @flow
import type {
	CalendarData,
	GetCalendarDataParams,
	ISetCalendarData
} from 'store/Calendar/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	calendarData: Array<CalendarData>,
	calendarId: string | null,
	error: Error | null,
	isLoading: boolean
};

export type ConnectedFunctions = {
	getCalendarData: (params: GetCalendarDataParams) => ThunkAction,
	setCalendarData: (calendarData: Array<CalendarData>) => ISetCalendarData
};

export type Props = ConnectedProps & ConnectedFunctions;
