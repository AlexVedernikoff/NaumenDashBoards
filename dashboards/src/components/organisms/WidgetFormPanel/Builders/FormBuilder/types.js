// @flow
import type {Select, SelectValue} from 'components/organisms/WidgetFormPanel/types';

export type TextAreaProps = {
	label: string,
	name: string,
	placeholder?: string,
	value: string
};

export type CheckBoxProps = {
	hideDivider?: boolean,
	label: string,
	name: string,
	value: string
};

export type LabelProps = {
	icon?: string,
	name: string,
	onClick?: () => void
};

export type State = {
	[string]: any
};

export type SelectProps = {
	options: Array<SelectValue>,
	value: SelectValue | null
} & Select;
