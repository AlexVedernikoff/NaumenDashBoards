// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {ChangingState, ThunkAction} from 'store/types';
import type {Context, UserData} from 'store/context/types';
import type {DivRef} from 'components/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {LayoutPayloadForChange} from 'store/dashboard/layouts/types';
import type {LayoutSize} from 'components/organisms/DiagramWidgetEditForm/types';
import type {NewToast} from 'store/toasts/types';
import {NewWidget} from 'entities';

export type SetFieldValue = (name: string, value: any, callback?: Function) => void;

export type SetDataFieldValue = (index: number, name: string, value: any, callback?: Function) => void;

export type Values = Object;

export type ErrorsMap = {
	[key: string]: string
};

export type UpdateWidget = (widget: Object, values: Values) => AnyWidget;

export type FormElement = HTMLDivElement | HTMLFormElement;

export type YupType = Object;

export type ValidateOptions = {
	abortEarly?: boolean,
	context?: Object,
	path?: string,
	recursive?: boolean,
	[string]: any
};

export type Schema = {
	validate(value: any, options?: ValidateOptions): Promise<void>;
};

export type OnSubmitCallback = (widget: AnyWidget) => void;

export type InjectedProps = {|
	cancelForm: () => ThunkAction,
	context: Context,
	errors: ErrorsMap,
	isNew: boolean,
	layoutMode: LayoutMode,
	onAddFieldErrorRef: DivRef => void,
	onChangeLayoutSize: (layoutSize: LayoutSize) => void,
	onSubmit: (func: UpdateWidget, callback?: OnSubmitCallback) => Promise<void>,
	personalDashboard: boolean,
	saving: ChangingState,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	setForm: (element: FormElement) => void,
	setSchema: (schema: Schema) => void,
	user: UserData,
	values: Values,
	widget: AnyWidget
|};

export type State = {
	errors: ErrorsMap,
	isSubmitting: boolean,
	schema: Schema | null,
	values: Values
};

export type ConnectedProps = {
	context: Context,
	layoutMode: LayoutMode,
	personalDashboard: boolean,
	saving: ChangingState,
	user: UserData,
	widget: AnyWidget | NewWidget,
	widgets: Array<AnyWidget>,
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	changeLayout: (payload: LayoutPayloadForChange) => Object,
	changeLayoutMode: (mode: LayoutMode) => ThunkAction,
	createToast: (newToast: $Exact<NewToast>) => ThunkAction,
	createWidget: AnyWidget => Object | void,
	saveWidget: AnyWidget => Object | void
};

export type Props = ConnectedProps & ConnectedFunctions;
