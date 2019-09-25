// @flow
import type {AttributesState} from './attributes/types';
import type {DataSourcesState} from './data/types';

export type SourcesState = {
	attributes: AttributesState,
	data: DataSourcesState
};
