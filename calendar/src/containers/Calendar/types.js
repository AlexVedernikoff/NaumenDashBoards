// @flow
import type {
	CalendarData,
	GetCalendarDataParams,
	ISetCalendarData,
	ResourceColor
} from 'store/Calendar/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	calendarData: Array<CalendarData>,
	calendarId: string | null,
	calendarResourceColorList: Array<ResourceColor>,
	error: Error | null,
	isLoading: boolean
};

export type ConnectedFunctions = {
	getCalendarData: (params: GetCalendarDataParams) => ThunkAction,
	getCalendarResourceColorList: () => ThunkAction,
	openEventLink: (linkId: string) => void | ThunkAction,
	setCalendarData: (calendarData: Array<CalendarData>) => ISetCalendarData
};

export type Props = ConnectedProps & ConnectedFunctions;