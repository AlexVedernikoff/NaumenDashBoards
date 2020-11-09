// @flow
import type {OnChangeInputEvent} from 'components/types';

export type OnChangeEvent = {
	name: string,
	value: any
};

export type InputProps = {
	name: string,
	onChange: OnChangeInputEvent => void,
	value: string
};

export type StyleBuilderProps = {|
	handleBoolChange: OnChangeInputEvent => void,
	handleChange: OnChangeEvent => void,
	handleConditionChange: OnChangeInputEvent => void,
	renderColorInput: ($Shape<InputProps> | void) => React$Node,
	renderFontFamilySelect: () => React$Node,
	renderFontSizeSelect: (usesAuto?: boolean) => React$Node,
	renderFontStyleButtons: ($Shape<InputProps> | void) => React$Node,
	renderSortingButtons: ($Shape<InputProps> | void) => React$Node,
	renderTextAlignButtons: ($Shape<InputProps> | void) => React$Node,
	renderTextHandlerButtons: ($Shape<InputProps> | void) => React$Node,
|};

type Data = Object;

export type Props = {
	data: Data,
	name: string,
	onChange: (name: string, data: Data) => void,
	render: StyleBuilderProps => React$Node
};

export type WrappedProps = Object;
