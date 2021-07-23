// @flow
import type {Option} from 'GroupModal/types';

export type State = {
	value: Option
};

export type Props = {
	onChange: (value: string) => void,
	options: Array<Option>,
	value: string
};
