// @flow
import type {Attribute, AttributesState} from './attributes/types';
import type {AttributesDataState} from './attributesData/types';
import type {CurrentObjectState} from './currentObject/types';
import type {DataSourcesState} from './data/types';
import type {DynamicGroupsState} from './dynamicGroups/types';
import type {LinkedAttributesState} from './linkedAttributes/types';
import type {LinkedDataSourcesState} from './linkedData/types';
import type {RefAttributesState} from './refAttributes/types';
import type {SourcesFiltersState} from './sourcesFilters/types';

export type OnLoadCallback = Array<Attribute> => void;

export type SourcesState = {
	attributes: AttributesState,
	attributes: AttributesState,
	attributesData: AttributesDataState,
	currentObject: CurrentObjectState,
	data: DataSourcesState,
	dynamicGroups: DynamicGroupsState,
	linkedAttributes: LinkedAttributesState,
	linkedData: LinkedDataSourcesState,
	refAttributes: RefAttributesState,
	sourcesFilters: SourcesFiltersState
};
