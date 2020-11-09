// @flow
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {OnChangeAttributeLabelEvent, OnChangeGroup, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';

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
