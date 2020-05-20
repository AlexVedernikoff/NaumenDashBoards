// @flow
import type {Attribute, AttributeMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DivRef, OnChangeLabelEvent, OnSelectEvent} from 'components/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {GroupAttributeField} from './components/AttributeGroupField/types';
import type {Node} from 'react';
import type {SetDataFieldValue, SetFieldValue, Values} from 'containers/WidgetFormPanel/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ContextProps = {|
	addFieldErrorRef: DivRef => void
|};

export type UpdateWidget = (widget: Widget, values: Values) => Widget;

export type ParamsTabProps = {|
	attributes: AttributeMap,
	context: Context,
	errors: Object,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute, callback: Function) => ThunkAction,
	isNew: boolean,
	refAttributes: AttributeMap,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sources: DataSourceMap,
	values: Values
|};

export type StyleTabProps = {|
	setFieldValue: (name: string, value: any) => void,
	values: Values
|};

export type RenderFormProps = {|
	renderParamsTab: ParamsTabProps => Node,
	renderStyleTab: StyleTabProps => Node,
	schema: Object,
	updateWidget: UpdateWidget,
|};

export type TypedFormProps = {|
	render: (props: RenderFormProps) => Node
|};

export type Props = {|
	attributes: AttributeMap,
	cancelForm: () => ThunkAction,
	context: Context,
	errors: Object,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute, callback: Function) => ThunkAction,
	isNew: boolean,
	onSubmit: (func: UpdateWidget) => Promise<void>,
	personalDashboard: boolean,
	refAttributes: AttributeMap,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	setSchema: (schema: Object) => void,
	sources: DataSourceMap,
	updating: boolean,
	user: UserData,
	values: Values
|};

export type State = {
	rendered: boolean
};

export type OnSelectAttributeEvent = {
	parent: Attribute | null,
	...$Exact<OnSelectEvent>
};

export type OnChangeAttributeLabelEvent = {
	parent: Attribute | null,
	...$Exact<OnChangeLabelEvent>
};

export type OnChangeGroup = (index: number, name: string, group: Group, field: GroupAttributeField) => void;

export type TransformAttribute = (event: OnSelectAttributeEvent, callback: Function, ...rest: Array<any>) => Attribute;
