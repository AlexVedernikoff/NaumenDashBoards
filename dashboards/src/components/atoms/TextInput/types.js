// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	maxLength: number,
	name: string,
	onChange: OnChangeInputEvent => void,
	onlyNumber: boolean,
	placeholder: string,
	value: InputValue
};
