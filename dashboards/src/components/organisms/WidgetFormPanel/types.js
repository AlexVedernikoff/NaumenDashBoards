// @flow
import type {Attribute, AttributeMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {Values} from 'containers/WidgetFormPanel/types';
import type {Widget} from 'store/widgets/data/types';

export type UpdateWidget = (widget: Widget, values: Values) => Widget;

export type ParamsTabProps = {|
	attributes: AttributeMap,
	context: Context,
	errors: Object,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute, callback: Function) => ThunkAction,
	isNew: boolean,
	refAttributes: AttributeMap,
	setDataFieldValue: (index: number) => Function,
	setDataFieldValues: (index: number) => Function,
	setFieldValue: (name: string, value: any) => void,
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
	setDataFieldValue: (index: number) => Function,
	setDataFieldValues: (index: number) => Function,
	setFieldValue: (name: string, value: any) => void,
	setSchema: (schema: Object) => void,
	sources: DataSourceMap,
	updating: boolean,
	user: UserData,
	values: Values
|};

export type State = {
	rendered: boolean
};
