// @flow
import type {CustomGroup, CustomGroupsMap} from 'store/customGroups/types';
import {FormikProps} from 'formik';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	customGroups: CustomGroupsMap,
	widgets: Array<Widget>
};

export type ConnectedFunctions = {
	removeCustomGroup: (groupId: string) => any,
	saveCustomGroup: (group: CustomGroup) => any
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
