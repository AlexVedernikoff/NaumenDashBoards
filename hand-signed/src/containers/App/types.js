// @flow
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	getAppConfig: () => ThunkAction
};

export type Props = ConnectedFunctions;
