// @flow
import type {DiagramsState} from './diagrams/types';
import type {WidgetsDataState} from './data/types';

export type WidgetsState = {
	data: WidgetsDataState,
	diagrams: DiagramsState
};
