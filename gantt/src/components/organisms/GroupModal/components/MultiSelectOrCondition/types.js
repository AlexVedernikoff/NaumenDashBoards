// @flow
import type {MultiSelectOperand, SelectData} from 'src/store/customGroups/types';
import type {Node} from 'react';
import type {OnSelectEvent} from 'src/components/types';

export type Value = Object;

export type RenderProps = {|
	onClear: () => void,
	onRemove: (index: number) => void,
	onSelect: (event: OnSelectEvent) => void,
	values: Array<SelectData>
|};

export type Props = {
	data: Array<SelectData>,
	getOptionValue: (option: Object) => string,
	onChange: MultiSelectOperand => void,
	render: (props: RenderProps) => Node,
	transform?: (SelectValue: Object) => SelectData,
	type: string
};
