// @flow
import type {Option} from 'GroupModal/types';

export type Props = {
	onChange: (value: string) => void,
	options: Array<Option>,
	value: string
};

export type Value = Option | null;

export type State = {
	value: Value
};
