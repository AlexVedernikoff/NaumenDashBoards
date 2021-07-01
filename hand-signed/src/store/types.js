// @flow
import type {SignatureState} from './signature/types';

type Action = {
	data?: any,
	type: string
};

export type AppState = {
	signature: SignatureState
};

/* eslint-disable no-use-before-define */
export type GetState = () => AppState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => PromiseAction;
/* eslint-enable no-use-before-define */
