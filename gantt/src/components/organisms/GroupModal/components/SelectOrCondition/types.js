// @flow
import type {Node} from 'react';
import type {OnSelectEvent} from 'components/types';
import type {OrCondition} from 'GroupModal/types';
import type {SelectData} from 'store/customGroups/types';

type SelectOrCondition = {
	data: SelectData,
	type: string
};

export type SelectValue = Object;

export type RenderProps = {|
	onSelect: (event: OnSelectEvent) => void,
	value: SelectValue | null
|};

export type Props = {
	onChange: SelectOrCondition => void,
	render: (props: RenderProps) => Node,
	transform?: (SelectValue: Object) => SelectData,
	value: OrCondition | SelectOrCondition
};
