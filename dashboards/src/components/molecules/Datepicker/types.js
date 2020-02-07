// @flow
import type Moment from 'moment';

export type Props = {
	onSelect: (date: string) => void,
	value: string
};

export type State = {
	currentDate: Moment
};
