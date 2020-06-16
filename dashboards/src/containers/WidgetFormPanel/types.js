// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {NewToast} from 'store/toasts/types';
import {NewWidget} from 'entities';
import type {OnLoadCallback} from 'store/sources/types';
import type {Source, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
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
	refAttributes: AttributesMap,
	sources: DataSourceMap,
	updating: boolean,
	user: UserData,
	widget: Widget | NewWidget,
	widgets: Array<Widget>,
};

export type FetchAttributes = (classFqn: string, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchRefAttributes = (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createToast: (newToast: $Exact<NewToast>) => ThunkAction,
	createWidget: Widget => Object | void,
	fetchAttributes: FetchAttributes,
	fetchRefAttributes: FetchRefAttributes,
	saveWidget: Widget => Object | void
};

export type Props = ConnectedProps & ConnectedFunctions;
