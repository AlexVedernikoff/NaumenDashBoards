// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DataSet, ErrorsMap, SetDataFieldValue, SetFieldValue, Values} from 'containers/WidgetFormPanel/types';
import type {OnChangeAttributeLabelEvent, OnChangeGroup, TransformAttribute} from 'WidgetFormPanel/types';

export type Props = {
	children: React$Node,
	errors: ErrorsMap,
	getAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	getSourceOptions: (classFqn: string) => Array<Attribute>,
	name: string,
	onChangeGroup: OnChangeGroup,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onSelectCallback: (parameterName: string) => Function,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	transformAttribute: TransformAttribute,
	useGroup: boolean,
	values: Values
};

export type State = {
	mainSet?: DataSet
};
