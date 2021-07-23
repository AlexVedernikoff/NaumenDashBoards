// @flow
import type {BuildDataState} from './buildData/types';
import type {LinksState} from './links/types';
import type {WidgetsDataState} from './data/types';

export type WidgetsState = {
	buildData: BuildDataState,
	data: WidgetsDataState,
	links: LinksState
};
