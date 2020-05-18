// @flow
import {BUILD_DATA_EVENTS} from './constants';
import type {SetCreatedWidget, UpdateWidget, WidgetType} from 'store/widgets/data/types';

export type PostData = {
	data: Object,
	type: WidgetType
};

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

export type ReceiveBuildData = {
	type: typeof BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA,
	payload: ReceiveBuildDataPayload
};

export type RecordErrorBuildData = {
	type: typeof BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR,
	payload: string
};

type UnknownBuildDataAction = {
	type: typeof BUILD_DATA_EVENTS.UNKNOWN_BUILD_DATA_ACTION
};

export type BuildDataAction =
	| ReceiveBuildData
	| RecordErrorBuildData
	| RequestBuildData
	| SetCreatedWidget
	| UpdateWidget
	| UnknownBuildDataAction
;

export type BuildDataState = BuildDataMap;
