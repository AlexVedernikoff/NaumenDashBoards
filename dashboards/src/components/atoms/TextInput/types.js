// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	className: string,
	disabled: boolean,
	maxLength: number | null,
	name: string,
	onBlur?: (SyntheticFocusEvent<HTMLInputElement>) => void,
	onChange: OnChangeInputEvent => void,
	onFocus?: (SyntheticFocusEvent<HTMLInputElement>) => void,
	onlyNumber: boolean,
	placeholder: string,
	value: InputValue
};
