// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	checked: boolean,
	name: string,
	onChange: OnChangeInputEvent => void,
	setTrigger?: (func: Function) => void,
	value: InputValue
};
