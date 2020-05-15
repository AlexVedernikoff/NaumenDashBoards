// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ErrorsMap, SetDataFieldValue, SetFieldValue, Values} from 'containers/WidgetFormPanel/types';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, TransformAttribute} from 'WidgetFormPanel/types';
import type {SourceOption} from 'components/organisms/AttributeCreatingModal/types';

export type Props = {
	children: React$Node,
	errors: ErrorsMap,
	getAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	getSourceOptions: (classFqn: string) => Array<Attribute>,
	name: string,
	onChangeGroup: (index: number, name: string, group: Group, field: GroupAttributeField) => void,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	renderLeftControl: Function,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	transformAttribute: TransformAttribute,
	useBreakdown: boolean,
	values: Values
};

export type State = {
	sources: Array<SourceOption>
};
