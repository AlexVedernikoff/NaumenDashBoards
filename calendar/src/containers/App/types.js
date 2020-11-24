// @flow
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	getInitParams: () => ThunkAction
};

export type Props = ConnectedFunctions;
