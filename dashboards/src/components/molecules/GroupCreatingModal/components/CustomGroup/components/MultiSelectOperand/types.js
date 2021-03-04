// @flow
import type {MultiSelectOperand, SelectData} from 'store/customGroups/types';
import type {Node} from 'react';
import type {OnSelectEvent} from 'components/types';

export type Value = Object;

export type RenderProps = {|
	onClear: () => void,
	onRemove: (value: string) => void,
	onSelect: (event: OnSelectEvent) => void,
	values: Array<SelectData>
|};

export type Props = {
	convert?: Value => SelectData,
	getOptionValue: (option: Object) => string,
	onChange: MultiSelectOperand => void,
	operand: MultiSelectOperand,
	render: (props: RenderProps) => Node
};
