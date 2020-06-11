// @flow
import type {DataSet} from 'containers/WidgetFormPanel/types';
import type {OnChangeAttributeLabelEvent, OnChangeGroup, OnSelectAttributeEvent} from 'WidgetFormPanel/types';

export type Props = {
	error: string,
	index: number,
	name: string,
	onChangeGroup: OnChangeGroup,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onRemove: (index: number) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	removable: boolean,
	set: DataSet
};
