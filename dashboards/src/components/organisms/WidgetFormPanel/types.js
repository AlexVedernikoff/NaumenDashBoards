// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {LayoutItem} from 'utils/layout/types';
import type {OptionType} from 'react-select/src/types';

export type State = {
	[string]: any
}

export type SelectValue = {
	[string]: any
};

export type InputProps = {
	[string]: any
};

export type CreateFormData = {
	layout: LayoutItem,
	name: string,
	type: OptionType,
	[string]: any
};

export type SaveFormData = {
	id: string
} & CreateFormData;

export type FormData = SaveFormData | CreateFormData;

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

export type ColorPickerProps = {
	key: number,
	label: string,
	name: string,
	value: string
};

type Select = {
	handleSelect?: (name: string, value: OptionType) => void | Promise<void>;
	isDisabled?: boolean,
	name: string,
	placeholder: string,
};

export type SelectProps = {
	options: Array<SelectValue>,
	value: SelectValue | null
} & Select;

export type AttrSelectProps = {
	options?: Array<Attribute>,
	value: Attribute | null
} & Select;

export type ButtonProps = {
	block?: boolean,
	disabled?: boolean,
	onClick: () => any,
	text: string,
	variant?: string
};

export type LabelProps = {
	name: string,
	onClick?: () => void,
	icon?: string
};

export type WrappedProps = {
	[string]: any
};

export type RenderFunction = (...fieldNames: Array<string>) => any;

export type GetRefOptions = (value: OptionType) => Array<OptionType>;
