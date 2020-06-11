// @flow
import type {Attribute, AttributesState} from './attributes/types';
import type {AttributesDataState} from './attributesData/types';
import type {CurrentObjectState} from './currentObject/types';
import type {DataSourcesState} from './data/types';
import type {RefAttributesState} from './refAttributes/types';

export type OnLoadCallback = Array<Attribute> => void;

export type SourcesState = {
	attributes: AttributesState,
	attributesData: AttributesDataState,
	currentObject: CurrentObjectState,
	data: DataSourcesState,
	refAttributes: RefAttributesState
};
