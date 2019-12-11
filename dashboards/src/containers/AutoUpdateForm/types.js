// @flow
import type {AutoUpdate, AutoUpdateRequestPayload} from 'store/dashboard/types';
import {FormikProps} from 'formik';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = AutoUpdate;

export type ConnectedFunctions = {
	saveAutoUpdateSettings: (payload: AutoUpdateRequestPayload) => ThunkAction,
};

export type Props = ConnectedProps & ConnectedFunctions & FormikProps;
