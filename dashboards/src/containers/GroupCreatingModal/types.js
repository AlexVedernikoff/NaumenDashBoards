// @flow
import type {CustomGroup, CustomGroupId, CustomGroupsMap} from 'store/customGroups/types';
import {FormikProps} from 'formik';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	customGroups: CustomGroupsMap,
	widgets: Array<Widget>
};

export type ConnectedFunctions = {
	createCustomGroup: (group: CustomGroup) => ThunkAction,
	deleteCustomGroup: (id: CustomGroupId) => ThunkAction,
	updateCustomGroup: (group: CustomGroup, remote?: boolean) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
