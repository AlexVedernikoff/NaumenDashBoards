// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {ChangingState, ThunkAction} from 'store/types';
import type {ComputedAttr, Group, Widget} from 'store/widgets/data/types';
import type {Context, UserData} from 'store/context/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DivRef, OnChangeLabelEvent, OnSelectEvent} from 'components/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {
	ErrorsMap,
	FetchAttributes,
	FetchDynamicAttributeGroups,
	FetchDynamicAttributes,
	FetchLinkedDataSources,
	FetchRefAttributes,
	SetDataFieldValue,
	SetFieldValue,
	Values
} from 'containers/WidgetFormPanel/types';
import type {GroupAttributeField} from './components/AttributeGroupField/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';
import type {Node} from 'react';

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

export type ContextProps = {|
	addFieldErrorRef: DivRef => void,
	attributes: AttributesMap,
	changeAttributeTitle: (value: Attribute | null, parent: Attribute | null, title: string) => Attribute | null,
	dynamicGroups: DynamicGroupsMap,
	errors: ErrorsMap,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes,
	handleChangeGroup: OnChangeGroup,
	refAttributes: AttributesMap,
	removeComputedAttribute: (attribute: ComputedAttr) => void,
	saveComputedAttribute: (attribute: ComputedAttr) => void,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sources: DataSourceMap,
	transformAttribute: TransformAttribute,
	values: Values
|};

export type UpdateWidget = (widget: Widget, values: Values) => Widget;

export type ParamsTabProps = {|
	context: Context,
	isNew: boolean,
	layoutMode: LayoutMode,
	personalDashboard: boolean,
	user: UserData
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
	fetchLinkedDataSources: FetchLinkedDataSources,
	fetchRefAttributes: FetchRefAttributes,
	isNew: boolean,
	layoutMode: LayoutMode,
	linkedSources: LinkedDataSourceMap,
	onSubmit: (func: UpdateWidget) => Promise<void>,
	personalDashboard: boolean,
	refAttributes: AttributesMap,
	saving: ChangingState,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	setSchema: (schema: Object) => void,
	sources: DataSourceMap,
	user: UserData,
	values: Values,
	widget: Widget
|};

export type State = {
	rendered: boolean
};
