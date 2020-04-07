// @flow
import type {Node} from 'react';
import type {SelectData, SelectOperand} from 'store/customGroups/types';

export type RenderProps = {|
	onSelect: (name: string, value: SelectData) => void,
	value: Object | null
|};

export type Props = {
	onChange: SelectOperand => void,
	operand: SelectOperand,
	render: (props: RenderProps) => Node
};
