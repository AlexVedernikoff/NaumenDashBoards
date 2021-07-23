// @flow
import {LIMIT_NAMES} from './constants';

export type LimitName = $Values<typeof LIMIT_NAMES>;

export type Props = {
	name: LimitName,
	onSubmit: LimitName => void,
	value: string | number,
	warningText: string
};

export type State = {
	showModal: boolean
};
