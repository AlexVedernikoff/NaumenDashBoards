// @flow
import type {InputValue, OnChangeEvent} from 'components/types';

export type Props = {
	checked: boolean,
	name: string,
	onChange: OnChangeEvent<any> => void,
	setTrigger?: (func: Function) => void,
	value: InputValue
};
