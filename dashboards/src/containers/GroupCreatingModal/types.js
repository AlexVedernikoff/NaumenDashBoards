// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup, CustomGroupsMap} from 'store/customGroups/types';
import {FormikProps} from 'formik';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	customGroups: CustomGroupsMap,
	widgets: Array<Widget>
};

export type ConnectedFunctions = {
	createCustomGroup: (group: CustomGroup) => ThunkAction,
	deleteCustomGroup: (id: string) => ThunkAction,
	fetchAttributesData: (attribute: Attribute, actual?: boolean) => ThunkAction,
	updateCustomGroup: (group: CustomGroup, remote?: boolean) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
