// @flow
import type {DiagramsAction, DiagramsState} from './types';
import {DIAGRAMS_EVENTS} from './constants';

export const initialDiagramsState: DiagramsState = {
	map: {}
};

export const defaultAction: DiagramsAction = {
	type: DIAGRAMS_EVENTS.UNKNOWN_DIAGRAMS_ACTION
};
