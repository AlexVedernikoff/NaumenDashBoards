// @flow
import type {Attribute, AttributeMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {CreateFormData, SaveFormData} from 'components/organisms/WidgetFormPanel/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {FormikProps} from 'formik';
import {NewWidget} from 'entities';
import type {Role} from 'store/dashboard/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	attributes: AttributeMap,
	context: Context,
	refAttributes: AttributeMap,
	role?: Role,
	saveError: boolean,
	selectedWidget: Widget | NewWidget,
	sources: DataSourceMap,
	updating: boolean
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createWidget: (data: CreateFormData, asDefault: boolean) => ThunkAction,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute) => ThunkAction,
	saveWidget: (data: SaveFormData, asDefault: boolean) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
