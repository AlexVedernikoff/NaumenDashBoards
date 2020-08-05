// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DivRef, OnChangeLabelEvent, OnSelectEvent} from 'components/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {
	FetchAttributes,
	FetchDynamicAttributeGroups,
	FetchDynamicAttributes,
	FetchRefAttributes,
	SetDataFieldValue,
	SetFieldValue,
	Values
} from 'containers/WidgetFormPanel/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {GroupAttributeField} from './components/AttributeGroupField/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ContextProps = {|
	addFieldErrorRef: DivRef => void,
	attributes: AttributesMap,
	dynamicGroups: DynamicGroupsMap,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes,
	refAttributes: AttributesMap,
	values: Values
|};

export type UpdateWidget = (widget: Widget, values: Values) => Widget;

export type ParamsTabProps = {|
	attributes: AttributesMap,
	context: Context,
	errors: Object,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes,
	isNew: boolean,
	layoutMode: LayoutMode,
	personalDashboard: boolean,
	refAttributes: AttributesMap,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sources: DataSourceMap,
	user: UserData,
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
	attributes: AttributesMap,
	cancelForm: () => ThunkAction,
	context: Context,
	dynamicGroups: DynamicGroupsMap,
	errors: Object,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes,
	isNew: boolean,
	layoutMode: LayoutMode,
	onSubmit: (func: UpdateWidget) => Promise<void>,
	personalDashboard: boolean,
	refAttributes: AttributesMap,
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
