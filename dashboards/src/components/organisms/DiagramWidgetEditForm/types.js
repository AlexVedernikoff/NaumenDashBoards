// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {ComputedAttr, Group} from 'store/widgets/data/types';
import type {Context, UserData} from 'store/context/types';
import type {DashboardsState, FetchDashboards} from 'store/dashboards/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DivRef, OnChangeLabelEvent, OnSelectEvent} from 'components/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {ErrorsMap, SetDataFieldValue, SetFieldValue, UpdateWidget, Values} from 'containers/WidgetEditForm/types';
import type {
	FetchAttributes,
	FetchDynamicAttributeGroups,
	FetchDynamicAttributes,
	FetchRefAttributes
} from 'containers/DiagramWidgetEditForm/types';
import type {GroupAttributeField} from './components/AttributeGroupField/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
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
	attributes: AttributesMap,
	changeAttributeTitle: (value: Attribute | null, parent: Attribute | null, title: string) => Attribute | null,
	dynamicGroups: DynamicGroupsMap,
	errors: ErrorsMap,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes,
	handleChangeGroup: OnChangeGroup,
	onAddFieldErrorRef: DivRef => void,
	refAttributes: AttributesMap,
	removeComputedAttribute: (attribute: ComputedAttr) => void,
	saveComputedAttribute: (attribute: ComputedAttr) => void,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sources: DataSourceMap,
	transformAttribute: TransformAttribute,
	values: Values
|};

export type ParamsTabProps = {|
	context: Context,
	dashboards: DashboardsState,
	fetchDashboards: FetchDashboards,
	isNew: boolean,
	layoutMode: LayoutMode,
	personalDashboard: boolean,
	user: UserData
|};

export type StyleTabProps = {|
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	values: Values
|};

export type LayoutSize = {|
	h: number,
	w: number
|};

export type RenderFormProps = {|
	layoutSize?: LayoutSize,
	renderParamsTab: ParamsTabProps => Node,
	renderStyleTab: StyleTabProps => Node,
	schema: Object,
	updateWidget: UpdateWidget,
|};

export type TypedFormProps = {|
	layoutMode: LayoutMode,
	render: (props: RenderFormProps) => Node
|};
