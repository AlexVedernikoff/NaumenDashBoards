// @flow
import type {DataSet} from 'containers/WidgetFormPanel/types';
import type {OnChangeAttributeLabelEvent, OnChangeGroup, OnSelectAttributeEvent} from 'WidgetFormPanel/types';

export type Props = {
	error: string,
	index: number,
	mainSet: DataSet,
	name: string,
	onChangeGroup: OnChangeGroup,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number, mainSet: boolean) => void,
	set: DataSet,
	useGroup: boolean
};
