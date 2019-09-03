// @flow
import {APP_EVENTS} from 'constants/app';
import type {AppAction, AppState} from 'types/app';
import {initialAppState, unknownAppAction} from 'init/app';

export const app = (state: AppState = initialAppState, action: AppAction = unknownAppAction): AppState => {
	switch (action.type) {
		case APP_EVENTS.ACTION_EXAMPLE:
			return {
				...state,
				counter: state.counter + 1
			};
		default:
			return state;
	}
};

export default app;
