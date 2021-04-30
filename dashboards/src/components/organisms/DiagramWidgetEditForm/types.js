// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {Context, UserData} from 'store/context/types';
import type {DashboardsState, FetchDashboards} from 'store/dashboards/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DivRef} from 'components/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {
	ErrorsMap,
	OnSubmitCallback,
	SetDataFieldValue,
	SetFieldValue,
	UpdateWidget,
	Values
} from 'containers/WidgetEditForm/types';
import type {
	FetchAttributes,
	FetchDynamicAttributeGroups,
	FetchDynamicAttributes,
	FetchRefAttributes
} from 'containers/DiagramWidgetEditForm/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {Node} from 'react';
import type {Widget} from 'store/widgets/data/types';

export type OnSelectAttributeEvent = {
	name: string,
	value: Attribute
};

export type OnChangeAttributeLabelEvent = OnSelectAttributeEvent;

export type ContextProps = {|
	attributes: AttributesMap,
	dynamicGroups: DynamicGroupsMap,
	errors: ErrorsMap,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes,
	onAddFieldErrorRef: DivRef => void,
	refAttributes: AttributesMap,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sources: DataSourceMap,
	values: Values
|};

export type OptionsTabProps = {|
	fetchAttributes: FetchAttributes,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	values: Values,
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
	values: Values,
	widget: Widget
|};

export type LayoutSize = {|
	h: number,
	w: number
|};

export type RenderFormProps = {|
	layoutSize?: LayoutSize,
	onSubmitCallback?: OnSubmitCallback,
	renderOptionsTab: OptionsTabProps => Node,
	renderParamsTab: ParamsTabProps => Node,
	renderStyleTab: StyleTabProps => Node,
	schema: Object,
	updateWidget: UpdateWidget,
|};

export type TypedFormProps = {|
	layoutMode: LayoutMode,
	render: (props: RenderFormProps) => Node,
	values: Values
|};
