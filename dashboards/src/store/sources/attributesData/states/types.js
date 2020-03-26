// @flow
import {STATES_EVENTS} from './constants';

export type Data = {
	title: string,
	uuid: string
};

export type StateData = {
	items: Array<Data>,
	error: boolean,
	loading: boolean
};

export type StatesMap = {
	[string]: StateData
};

export type ReceivePayload = {
	data: Array<Data>,
	metaClassFqn: string
};

type ReceiveStateData = {
	type: typeof STATES_EVENTS.RECEIVE_META_CLASS_STATES,
	payload: ReceivePayload
};

type RecordStateDataError = {
	type: typeof STATES_EVENTS.RECORD_META_CLASS_STATES_ERROR,
	payload: string
};

type RequestStateData = {
	type: typeof STATES_EVENTS.REQUEST_META_CLASS_STATES,
	payload: string
};

type UnknownStatesAction = {
	type: typeof STATES_EVENTS.UNKNOWN_STATES_ACTION
};

export type StatesAction =
	| ReceiveStateData
	| RecordStateDataError
	| RequestStateData
	| UnknownStatesAction
;

export type StatesState = StatesMap;
