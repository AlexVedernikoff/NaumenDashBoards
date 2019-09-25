// @flow
import type {ChartsState} from './charts/types';
import type {WidgetsDataState} from './data/types';

export type WidgetsState = {
	charts: ChartsState,
	data: WidgetsDataState
};
