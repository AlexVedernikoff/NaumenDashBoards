// @flow
import type {InputRef, InputValue, OnChangeEvent} from 'components/types';

export type Props = {
	className: string,
	disabled: boolean,
	forwardedRef?: InputRef,
	maxLength: number | null,
	name: string,
	onBlur?: (SyntheticFocusEvent<HTMLInputElement>) => void,
	onChange: OnChangeEvent<string> => void,
	onFocus?: (SyntheticFocusEvent<HTMLInputElement>) => void,
	onlyNumber: boolean,
	placeholder: string,
	value: InputValue
};
