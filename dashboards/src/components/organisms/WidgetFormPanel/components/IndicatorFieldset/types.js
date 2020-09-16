// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import type {ContextProps, OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {DataSet, SetDataFieldValue} from 'containers/WidgetFormPanel/types';

export type Props = {
	...ContextProps,
	aggregation: string,
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
	set: DataSet,
	usesNotApplicableAggregation: boolean,
	value: Object | null
};

export type State = {
	showCreatingModal: boolean
};
