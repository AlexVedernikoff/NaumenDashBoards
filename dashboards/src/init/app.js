// @flow
import {APP_EVENTS} from 'constants/app';
import type {AppAction, AppState} from 'types/app';

const initialAppState: AppState = {
	counter: 0
};

const unknownAppAction: AppAction = {
	type: APP_EVENTS.UNKNOWN
};

export {
	initialAppState,
	unknownAppAction
};
