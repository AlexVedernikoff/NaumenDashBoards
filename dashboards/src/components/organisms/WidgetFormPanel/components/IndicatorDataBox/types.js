// @flow
import type {DataSet, ErrorsMap, SetDataFieldValue, SetFieldValue, Values} from 'containers/WidgetFormPanel/types';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, TransformAttribute} from 'WidgetFormPanel/types';

export type Props = {
	children: React$Node,
	errors: ErrorsMap,
	index: number,
	name: string,
	onChangeGroup: (index: number, name: string, group: Group, field: GroupAttributeField) => void,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	renderLeftControl?: (set: DataSet, index: number) => React$Node,
	set: DataSet,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	transformAttribute: TransformAttribute,
	useBreakdown: boolean,
	values: Values
};
