// @flow
import type {AttributeMap} from 'store/sources/attributes/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {Context} from 'utils/api/types';
import {FormikProps} from 'formik';
import {NewWidget} from 'entities';
import type {Role} from 'store/dashboard/types';
import type {SaveFormData, CreateFormData} from 'components/organisms/WidgetFormPanel/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	attributes: AttributeMap,
	context: Context,
	role: Role,
	saveError: boolean,
	selectedWidget: Widget | NewWidget,
	sources: DataSourceMap,
	updating: boolean
};

export type ValidateType = {
	type: {
		value: string
	}
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createWidget: (data: CreateFormData, asDefault: boolean) => ThunkAction,
	fetchAttributes: (classFqn: string) => ThunkAction,
	saveWidget: (data: SaveFormData, asDefault: boolean) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
