// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	className: string,
	disabled: boolean,
	maxLength: number | null,
	name: string,
	onChange: OnChangeInputEvent => void,
	onlyNumber: boolean,
	placeholder: string,
	value: InputValue
};
