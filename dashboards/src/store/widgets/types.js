// @flow
import type {DiagramsState} from './diagrams/types';
import type {LinksState} from './links/types';
import type {WidgetsDataState} from './data/types';

export type WidgetsState = {
	data: WidgetsDataState,
	diagrams: DiagramsState,
	links: LinksState
};
