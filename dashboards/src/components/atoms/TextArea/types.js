// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	focusOnMount: boolean | null,
	label: string,
	maxLength: number | null,
	name: string,
	onBlur?: (e: any) => void,
	onChange: OnChangeInputEvent => void,
	placeholder: string,
	value: InputValue
};
