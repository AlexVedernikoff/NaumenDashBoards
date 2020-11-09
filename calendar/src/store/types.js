// @flow
import type {CalendarSelectorsState} from './CalendarSelectors/types';
import type {CalendarState} from './Calendar/types';

export type ChangingState = {
	error: boolean,
	loading: boolean
};

export type ResponseError = {
	responseText: string,
	status: number,
	statusText: string
};

type Action = {
	data?: any,
	type: string
};

export type State = {
	calendar: CalendarState,
	calendarSelectors: CalendarSelectorsState
};

/* eslint-disable no-use-before-define */
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => void;
/* eslint-enable no-use-before-define */
