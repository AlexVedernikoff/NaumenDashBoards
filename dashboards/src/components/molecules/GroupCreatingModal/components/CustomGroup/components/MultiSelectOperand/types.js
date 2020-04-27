// @flow
import type {MultiSelectOperand, SelectData} from 'store/customGroups/types';
import type {Node} from 'react';

export type Value = Object;

export type RenderProps = {|
	onClear: () => void,
	onRemove: (value: string) => void,
	onSelect: (name: string, value: Object) => void,
	values: Array<SelectData>
|};

export type Props = {
	convert?: Value => SelectData,
	getOptionValue: (option: Object) => string,
	onChange: MultiSelectOperand => void,
	operand: MultiSelectOperand,
	render: (props: RenderProps) => Node
};
