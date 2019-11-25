// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Node} from 'react';
import type {OptionType} from 'react-select/src/types';
import type {SelectProps} from 'components/organisms/WidgetFormPanel/Builders/FormBuilder/types';

export type OnSelectCallback = (...any) => void;

export type AttrProps = {
	onSelect?: any,
	onSelectCallback?: OnSelectCallback,
	parent?: Attribute,
	refInput?: Node,
	withDivider?: boolean
} & SelectProps;

export type SelectMixin = {
	[string]: any
};

export type GetRefOptions = (value: OptionType) => Array<OptionType>;
