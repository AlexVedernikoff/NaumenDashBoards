// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {LayoutItem} from 'utils/layout/types';
import type {OptionType} from 'react-select/src/types';

export type SelectValue = {
	label: string,
	value: string
};

export type CreateFormData = {
	aggregate: SelectValue,
	areAxisesNamesShown: boolean,
	areAxisesLabelsShown: boolean,
	areAxisesMeaningsShown: boolean,
	breakdown: Attribute | null,
	chart: SelectValue,
	color: Array<string>,
	desc: string,
	group: SelectValue | null,
	isLegendShown: boolean;
	isNameShown: boolean,
	layout: LayoutItem,
	legendPosition: SelectValue,
	name: string,
	source: SelectValue,
	xAxis: Attribute,
	yAxis: Attribute
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
	key: number,
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

export type FormBuilderProps = any
export type FormBuilderStore = any

type Select = {
	label?: string,
	name: string,
	onChange?: (name: string, option: OptionType) => void;
	placeholder: string,
};

export type SelectProps = {
	options: Array<SelectValue>,
	value: SelectValue | null
} & Select;

export type AttrSelectProps = {
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
