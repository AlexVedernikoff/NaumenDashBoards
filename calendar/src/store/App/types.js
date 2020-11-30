// @flow
import {APP_EVENTS} from './constants';

export type InitParams = {
	defaultView: string,
	hideWeekend: boolean,
	metaClass: string | null,
	subjectId: string | null
};

export type AppState = {
	+defaultView: string,
	+error: Error | null,
	+hideWeekend: boolean,
	+isLoading: boolean,
	+metaClass: string | null,
	+subjectId: string | null
};

export type ISetAppLoading = {
	payload: boolean,
	type: typeof APP_EVENTS.SET_APP_LOADING
};

export type ISetError = {
	payload: Error,
	type: typeof APP_EVENTS.SET_ERROR
};

export type ISetInitData = {
	payload: InitParams,
	type: typeof APP_EVENTS.SET_APP_INIT_DATA
};

export type ActionType =
	| ISetAppLoading
	| ISetError
	| ISetInitData;
