// @flow
import {BUILD_DATA_EVENTS} from './constants';
import type {SetCreatedWidget, UpdateWidget, Widget} from 'store/widgets/data/types';

export type DiagramBuildData = {
	[string]: any
};

export type BuildData = {
	data: DiagramBuildData,
	error: boolean,
	loading: boolean,
	updateDate?: Date | ''
};

export type BuildDataMap = {
	[key: string]: BuildData
};

export type ReceiveBuildDataPayload = {
	data: DiagramBuildData,
	id: string
};

export type RequestBuildData = {
	type: typeof BUILD_DATA_EVENTS.REQUEST_BUILD_DATA,
	payload: string
};

export type RequestAllBuildData = {
	type: typeof BUILD_DATA_EVENTS.REQUEST_ALL_BUILD_DATA,
	payload: Array<Widget>
};

export type ReceiveBuildData = {
	type: typeof BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA,
	payload: ReceiveBuildDataPayload
};

export type ReceiveAllBuildData = {
	type: typeof BUILD_DATA_EVENTS.RECEIVE_ALL_BUILD_DATA,
	payload: {
		[string]: DiagramBuildData
	}
};

export type RecordErrorBuildData = {
	type: typeof BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR,
	payload: string
};

export type RecordErrorAllBuildData = {
	type: typeof BUILD_DATA_EVENTS.RECORD_ALL_BUILD_DATA_ERROR,
	payload: Array<Widget>
};

type UnknownBuildDataAction = {
	type: typeof BUILD_DATA_EVENTS.UNKNOWN_BUILD_DATA_ACTION
};

export type BuildDataAction =
	| ReceiveAllBuildData
	| ReceiveBuildData
	| RecordErrorAllBuildData
	| RecordErrorBuildData
	| RequestAllBuildData
	| RequestBuildData
	| SetCreatedWidget
	| UpdateWidget
	| UnknownBuildDataAction
;

export type BuildDataState = BuildDataMap;
