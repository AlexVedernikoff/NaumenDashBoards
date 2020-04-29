// @flow
import type {OnChangeInputEvent} from 'components/types';

export type TextAreaProps = {
	errorPath?: string,
	handleBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	handleChange: OnChangeInputEvent => void,
	label: string,
	maxLength?: number,
	name: string,
	placeholder?: string,
	value: string
};

export type CheckboxProps = {
	label: string,
	name: string,
	onClick?: () => void,
	value: boolean
};

export type RenderFunction = (index: number, ...otherProps: Array<any>) => React$Node;
