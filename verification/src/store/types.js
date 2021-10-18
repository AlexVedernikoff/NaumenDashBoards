// @flow
import type {AttributesState} from './attributes/types';
import type {SettingState} from './setting/types';
import type {UserState} from './user/types';

type Action = {
	data?: any,
	type: string
};

export type State = {
	attributes: AttributesState,
	setting: SettingState,
	user: UserState
};

/* eslint-disable no-use-before-define */
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => PromiseAction;
/* eslint-enable no-use-before-define */
