// @flow
import type {Node} from 'react';
import type {OnSelectEvent} from 'components/types';
import type {SelectData, SelectOperand} from 'store/customGroups/types';

export type Value = Object;

export type RenderProps = {|
	onSelect: (event: OnSelectEvent) => void,
	value: Object | null
|};

export type Props = {
	convert?: Value => SelectData,
	onChange: SelectOperand => void,
	operand: SelectOperand,
	render: (props: RenderProps) => Node
};
