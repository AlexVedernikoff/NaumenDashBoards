// @flow
import type {OnChangeInputEvent} from 'components/types';

export type Props = {
	children: React$Node,
	handleChange: OnChangeInputEvent => void,
	label: string,
	name: string,
	value: boolean
};
