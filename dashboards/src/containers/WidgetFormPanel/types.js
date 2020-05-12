// @flow
import type {Attribute, AttributeMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {NewToast} from 'store/toasts/types';
import {NewWidget} from 'entities';
import type {OnLoadCallback} from 'store/sources/refAttributes/types';
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
	attributes: AttributeMap,
	context: Context,
	personalDashboard: boolean,
	refAttributes: AttributeMap,
	sources: DataSourceMap,
	updating: boolean,
	user: UserData,
	widget: Widget | NewWidget,
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createToast: (newToast: $Exact<NewToast>) => ThunkAction,
	createWidget: Widget => ThunkAction,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction,
	saveWidget: Widget => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
