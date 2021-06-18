// @flow
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
    getCustomGroup: (payload: string) => ThunkAction,
};
