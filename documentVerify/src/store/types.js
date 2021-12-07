// @flow
import type {VerifyState} from './verify/types';

type Action = {
	data?: any,
	type: string
};

export type State = {
	verify: VerifyState,
};

/* eslint-disable no-use-before-define */
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => PromiseAction;
/* eslint-enable no-use-before-define */
