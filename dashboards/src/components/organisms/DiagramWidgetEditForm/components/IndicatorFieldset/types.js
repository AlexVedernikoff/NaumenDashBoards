// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import type {ContextProps, OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {SetDataFieldValue} from 'containers/WidgetEditForm/types';

export type Props = {
	...ContextProps,
	aggregation: string,
	dataSet: DataSet,
	dataSetIndex: number,
	error: string,
	index: number,
	name: string,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onRemove: (index: number) => void,
	onRemoveComputedAttribute: (index: number, name: string, attribute: ComputedAttr) => void,
	onSaveComputedAttribute: (index: number, name: string, attribute: ComputedAttr) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	onSelectAggregation: SetDataFieldValue,
	removable: boolean,
	usesNotApplicableAggregation: boolean,
	value: Object | null
};

export type State = {
	showCreatingModal: boolean
};
