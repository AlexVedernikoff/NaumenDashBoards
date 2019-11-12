// @flow
import {DIAGRAMS_EVENTS} from './constants';
import type {SetCreatedWidget, UpdateWidget} from 'store/widgets/data/types';

export type CompositeFields = {
	nested: Array<string>,
	simple: Array<string>
}

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

export type ReceiveDiagram = {
	type: typeof DIAGRAMS_EVENTS.RECEIVE_DIAGRAM,
	payload: ReceiveDiagramPayload
};

export type RecordErrorDiagram = {
	type: typeof DIAGRAMS_EVENTS.RECORD_DIAGRAM_ERROR,
	payload: string
};

type UnknownDiagramsAction = {
	type: typeof DIAGRAMS_EVENTS.UNKNOWN_DIAGRAMS_ACTION
};

export type DiagramsAction =
	| RequestDiagram
	| ReceiveDiagram
	| RecordErrorDiagram
	| SetCreatedWidget
	| UpdateWidget
	| UnknownDiagramsAction
;

export type DiagramsState = {
	map: DiagramMap
};
