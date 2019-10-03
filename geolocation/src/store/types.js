// @flow
import type {GeolocationState} from './geolocation/types';

export type Error = {
	status: number,
	message: string
};

type Action = {
	data?: any,
	type: string
};

export type AppState = {
	geolocation: GeolocationState
};

/* eslint-disable no-use-before-define */
export type GetState = () => AppState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => void;
/* eslint-enable no-use-before-define */
