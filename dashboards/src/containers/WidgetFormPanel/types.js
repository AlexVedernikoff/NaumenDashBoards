// @flow
import type {Attribute, AttributeMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {CreateFormData, SaveFormData} from 'components/organisms/WidgetFormPanel/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {FormikProps} from 'formik';
import {NewWidget} from 'entities';
import type {OnLoadCallback} from 'store/sources/refAttributes/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	attributes: AttributeMap,
	context: Context,
	personalDashboard: boolean,
	refAttributes: AttributeMap,
	saveError: boolean,
	selectedWidget: Widget | NewWidget,
	sources: DataSourceMap,
	updating: boolean,
	user: UserData
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createWidget: (data: CreateFormData, asDefault: boolean) => ThunkAction,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction,
	saveWidget: (data: SaveFormData, asDefault: boolean) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
