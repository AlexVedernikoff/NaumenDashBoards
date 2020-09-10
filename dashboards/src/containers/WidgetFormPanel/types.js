// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {ChangingState, ThunkAction} from 'store/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';
import type {NewToast} from 'store/toasts/types';
import {NewWidget} from 'entities';
import type {OnLoadCallback} from 'store/sources/types';
import type {Source, Widget} from 'store/widgets/data/types';
import type {UserData} from 'store/context/types';

export type SetFieldValue = (name: string, value: any) => void;

export type SetDataFieldValue = (index: number, name: string, value: any, callback?: Function) => void;

export type DataSet = {
	source: Source,
	sourceForCompute: boolean,
	[string]: any
};

export type Values = Object;

export type ErrorsMap = {
	[key: string]: string
};

export type State = {
	errors: ErrorsMap,
	isSubmitting: boolean,
	schema: null | Object,
	values: Values,
	valuesSet: boolean
};

export type ConnectedProps = {
	attributes: AttributesMap,
	context: Context,
	dynamicGroups: DynamicGroupsMap,
	layoutMode: LayoutMode,
	linkedSources: LinkedDataSourceMap,
	personalDashboard: boolean,
	refAttributes: AttributesMap,
	saving: ChangingState,
	sources: DataSourceMap,
	user: UserData,
	widget: Widget | NewWidget,
	widgets: Array<Widget>,
};

export type FetchAttributes = (classFqn: string, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchDynamicAttributeGroups = (dataKey: string, descriptor: string) => ThunkAction;

export type FetchDynamicAttributes = (dataKey: string, groupCode: string) => ThunkAction;

export type FetchRefAttributes = (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchLinkedDataSources = (classFqn: string) => ThunkAction;

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	changeLayoutMode: (mode: LayoutMode) => ThunkAction,
	createToast: (newToast: $Exact<NewToast>) => ThunkAction,
	createWidget: Widget => Object | void,
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchLinkedDataSources: FetchLinkedDataSources,
	fetchRefAttributes: FetchRefAttributes,
	saveWidget: Widget => Object | void
};

export type Props = ConnectedProps & ConnectedFunctions;
