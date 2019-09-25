// @flow
import type {AttributeMap} from 'store/sources/attributes/types';
import {FormikProps} from 'formik';
import {NewWidget} from 'entities';
import type {SaveFormData, CreateFormData} from 'components/organisms/WidgetFormPanel/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	attributes: AttributeMap,
	isLoadingAttr: boolean,
	selectedWidget: Widget | NewWidget
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createWidget: (data: CreateFormData) => ThunkAction,
	fetchAttributes: (fqn: string) => ThunkAction,
	saveWidget: (data: SaveFormData, id: string) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
