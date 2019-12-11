// @flow
import {DIAGRAMS_EVENTS} from './constants';
import type {SetCreatedWidget, UpdateWidget, Widget} from 'store/widgets/data/types';

export type DiagramData = {
	[string]: any
};

export type Diagram = {
	data?: DiagramData | null,
	error: boolean,
	loading: boolean
};

export type DiagramMap = {
	[key: string]: Diagram
};

export type ReceiveDiagramPayload = {
	data: DiagramData,
	id: string
};

export type RequestDiagram = {
	type: typeof DIAGRAMS_EVENTS.REQUEST_DIAGRAM,
	payload: string
};

export type RequestDiagrams = {
	type: typeof DIAGRAMS_EVENTS.REQUEST_DIAGRAMS,
	payload: Array<Widget>
};

export type ReceiveDiagram = {
	type: typeof DIAGRAMS_EVENTS.RECEIVE_DIAGRAM,
	payload: ReceiveDiagramPayload
};

export type ReceiveDiagrams = {
	type: typeof DIAGRAMS_EVENTS.RECEIVE_DIAGRAMS,
	payload: {
		[string]: DiagramData
	}
};

export type RecordErrorDiagram = {
	type: typeof DIAGRAMS_EVENTS.RECORD_DIAGRAM_ERROR,
	payload: string
};

export type RecordErrorDiagrams = {
	type: typeof DIAGRAMS_EVENTS.RECORD_DIAGRAMS_ERROR,
	payload: Array<Widget>
};

type UnknownDiagramsAction = {
	type: typeof DIAGRAMS_EVENTS.UNKNOWN_DIAGRAMS_ACTION
};

export type DiagramsAction =
	| RequestDiagram
	| RequestDiagrams
	| ReceiveDiagram
	| ReceiveDiagrams
	| RecordErrorDiagram
	| RecordErrorDiagrams
	| SetCreatedWidget
	| UpdateWidget
	| UnknownDiagramsAction
;

export type DiagramsState = DiagramMap;
