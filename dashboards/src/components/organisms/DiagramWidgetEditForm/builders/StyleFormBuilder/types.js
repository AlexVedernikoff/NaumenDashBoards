// @flow
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';

export type OnChangeEvent = {
	name: string,
	value: any
};

export type InputProps = {
	name: string,
	onChange: OnChangeInputEvent => void,
	value: string
};

export type SelectProps = {
	name: string,
	onSelect: OnSelectEvent => void,
	value: any
};

export type FontSizeSelectProps = {
	...SelectProps,
	editable: boolean,
	options: Array<number>,
	usesAuto: boolean
};

export type StyleBuilderProps = {|
	handleBoolChange: OnChangeInputEvent => void,
	handleChange: OnChangeEvent => void,
	handleConditionChange: OnChangeInputEvent => void,
	renderColorInput: (props?: $Shape<InputProps>) => React$Node,
	renderFontFamilySelect: (props?: $Shape<SelectProps>) => React$Node,
	renderFontSizeSelect: (props?: $Shape<FontSizeSelectProps>) => React$Node,
	renderFontStyleButtons: (props?: $Shape<InputProps>) => React$Node,
	renderTextAlignButtons: (props?: $Shape<InputProps>) => React$Node,
	renderTextHandlerButtons: (props?: $Shape<InputProps>) => React$Node,
|};

type Data = Object;

export type Props = {
	data: Data,
	onChange: (name: string, value: any) => void,
	render: StyleBuilderProps => React$Node
};

export type WrappedProps = Object;
