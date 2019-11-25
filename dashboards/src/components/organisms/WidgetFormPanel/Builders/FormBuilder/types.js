// @flow
import type {Form} from 'components/molecules/Select/types';
import type {Option} from 'components/molecules/MiniSelect/types';
import type {OptionType} from 'react-select/src/types';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';

export type TextAreaProps = {
	handleBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
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

export type MiniSelectProps = {
	name: string,
	onSelect?: (name: string, value: string) => any,
	options: Array<Option>,
	showCaret?: boolean,
	tip: string,
	value: string
}

export type State = {
	[string]: any
};

export type SelectProps = {
	attr?: boolean,
	components?: {[string]: any},
	createButtonText?: string,
	form?: Form,
	isDisabled?: boolean,
	isEditableLabel?: boolean,
	hideError?: boolean,
	name: string,
	onClickCreateButton?: () => void,
	onRemove?: (name: string) => void,
	onSelect?: (name: string, value: OptionType) => void | Promise<void>;
	options?: Array<SelectValue>,
	placeholder?: string,
	showBorder?: boolean,
	value: SelectValue | null,
	withCreate?: boolean
};
