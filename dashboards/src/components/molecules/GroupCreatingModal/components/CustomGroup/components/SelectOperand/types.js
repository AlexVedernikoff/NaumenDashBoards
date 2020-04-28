// @flow
import type {Node} from 'react';
import type {SelectData, SelectOperand} from 'store/customGroups/types';

export type Value = Object;

export type RenderProps = {|
	onSelect: (name: string, value: Value) => void,
	value: Object | null
|};

export type Props = {
	convert?: Value => SelectData,
	onChange: SelectOperand => void,
	operand: SelectOperand,
	render: (props: RenderProps) => Node
};
