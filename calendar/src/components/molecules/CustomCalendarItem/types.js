// @flow
import type {CalendarData} from 'store/Calendar/types';
import type {ObjectType} from 'utils/types';

export type Props = {
	dataItem: CalendarData,
	onEventClick: (linkId: string) => void
} & ObjectType;
