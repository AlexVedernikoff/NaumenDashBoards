// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	checked: boolean,
	disabled: boolean,
	name: string,
	onChange: OnChangeInputEvent => void,
	value: InputValue
};
