// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedAttr} from 'store/widgets/data/types';
import type {DataSet, SetDataFieldValue} from 'containers/WidgetFormPanel/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {SourceOption} from 'components/organisms/AttributeCreatingModal/types';

export type Props = {
	computedAttrs: Array<ComputedAttr>,
	error: string,
	getAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	getSourceOptions: (classFqn: string) => Array<Attribute>,
	index: number,
	name: string,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onRemoveComputedAttribute: (index: number, name: string, code: string) => void,
	onSaveComputedAttribute: (index: number, name: string, attribute: ComputedAttr) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	onSelectAggregation: SetDataFieldValue,
	set: DataSet,
	sources: Array<SourceOption>
};

export type State = {
	showCreatingModal: boolean
};
