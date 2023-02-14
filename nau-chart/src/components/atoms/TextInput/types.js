// @flow
import type {OnChangeEvent, Ref} from 'components/atoms/types';

export type Props = {
	className: string,
	disabled: boolean,
	forwardedRef?: Ref<'input'>,
	maxLength: number | null,
	name: string,
	onBlur?: (SyntheticFocusEvent<HTMLInputElement>) => void,
	onChange: OnChangeEvent<string> => void,
	onFocus?: (SyntheticFocusEvent<HTMLInputElement>) => void,
	onlyNumber: boolean,
	placeholder: string,
	value: string
};
