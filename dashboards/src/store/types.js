// @flow
import type {DashboardState} from './dashboard/types';
import type {SourcesState} from './sources/types';
import type {WidgetsState} from './widgets/types';

export type Error = {
	status: number,
	message: string
};

type Action = {
	data?: any,
	type: string
};

export type AppState = {
	dashboard: DashboardState,
	sources: SourcesState,
	widgets: WidgetsState
};

/* eslint-disable no-use-before-define */
export type GetState = () => AppState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => void;
/* eslint-enable no-use-before-define */
