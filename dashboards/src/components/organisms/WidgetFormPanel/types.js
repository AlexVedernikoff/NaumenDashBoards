// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {LayoutItem} from 'types/layout';
import type {OptionType} from 'react-select/src/types';

export type SelectValue = {
	label: string,
	value: string
};

export type SaveFormData = {
	aggregate: SelectValue,
	chart: SelectValue,
	desc: string,
	group: SelectValue | null,
	isNameShown: boolean,
	name: string,
	source: SelectValue,
	xAxis: Attribute,
	yAxis: Attribute
};

export type CreateFormData = {
	layout: LayoutItem
} & SaveFormData;

export type FormData = SaveFormData | CreateFormData;

export type TextAreaProps = {
	label: string,
	name: string,
	placeholder?: string,
	value: string
};

export type CheckBoxProps = {
	label: string,
	name: string,
	value: string
};

export type TreeSelectProps = {
	name: string,
	value: SelectValue | null
};

export type SelectProps = {
	name: string,
	options: Array<SelectValue>,
	placeholder: string,
	value: SelectValue | null
};

export type AttrSelectProps = {
	isLoading: boolean,
	name: string,
	onChange: (value: OptionType) => void,
	options: Array<Attribute>,
	placeholder: string,
	value: Attribute
};
