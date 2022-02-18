// @flow
export type Data = {
	title: string,
	uuid: string
};

export type StateData = {
	error: boolean,
	items: Array<Data>,
	loading: boolean
};

export type StatesMap = {
	[string]: StateData
};

export type ReceivePayload = {
	data: Array<Data>,
	metaClassFqn: string
};

type ReceiveStateData = {payload: ReceivePayload, type: 'RECEIVE_META_CLASS_STATES'};

type RecordStateDataError = {payload: string, type: 'RECORD_META_CLASS_STATES_ERROR'};

type RequestStateData = {payload: string, type: 'REQUEST_META_CLASS_STATES'};

type UnknownStatesAction = { type: 'UNKNOWN_STATES_ACTION'};

export type StatesAction =
	| ReceiveStateData
	| RecordStateDataError
	| RequestStateData
	| UnknownStatesAction
;

export type StatesState = StatesMap;
