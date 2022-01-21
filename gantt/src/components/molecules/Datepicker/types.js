// @flow
import moment from 'utils/moment.config';

export type Props = {
	onSelect: (date: string) => void,
	value: string
};

export type State = {
	currentDate: typeof moment;
};
