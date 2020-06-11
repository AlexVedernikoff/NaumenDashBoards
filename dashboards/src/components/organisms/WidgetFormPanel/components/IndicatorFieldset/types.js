// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import type {ContextProps, OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {DataSet, SetDataFieldValue} from 'containers/WidgetFormPanel/types';

export type Props = {
	...ContextProps,
	error: string,
	index: number,
	name: string,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onRemoveComputedAttribute: (index: number, name: string, code: string) => void,
	onSaveComputedAttribute: (index: number, name: string, attribute: ComputedAttr) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	onSelectAggregation: SetDataFieldValue,
	set: DataSet
};

export type State = {
	showCreatingModal: boolean
};
