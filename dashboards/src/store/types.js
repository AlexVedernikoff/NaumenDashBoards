// @flow
import type {CommonDialogsState} from './commonDialogs/types';
import type {ContextState} from './context/types';
import type {CustomGroupsState} from './customGroups/types';
import type {DashboardState} from './dashboard/types';
import type {DashboardsState} from './dashboards/types';
import type {SourcesState} from './sources/types';
import type {ToastsState} from './toasts/types';
import type {UsersState} from './users/types';
import type {WidgetFormsState} from './widgetForms/types';
import type {WidgetsState} from './widgets/types';

export type ChangingState = {
	error: boolean,
	loading: boolean
};

export type ResponseError = {
	responseText: string,
	status: number,
	statusText: string
};

export type Action = {
	data?: any,
	type: string
};

export type AppState = {
	commonDialogs: CommonDialogsState,
	context: ContextState,
	customGroups: CustomGroupsState,
	dashboard: DashboardState,
	dashboards: DashboardsState,
	sources: SourcesState,
	toasts: ToastsState,
	users: UsersState,
	widgetForms: WidgetFormsState,
	widgets: WidgetsState
};

/* eslint-disable no-use-before-define */
export type GetState = () => AppState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => void;
export type Store = {
	getState: () => AppState
};
/* eslint-enable no-use-before-define */
