// @flow
import type {CatalogItemSetsState} from './catalogItemSets/types';
import type {CatalogItemsState} from './catalogItems/types';
import type {MetaClassesState} from './metaClasses/types';
import type {ObjectsState} from './objects/types';
import type {StatesState} from './states/types';

export type AttributesDataState = {
	catalogItemSets: CatalogItemSetsState,
	catalogItems: CatalogItemsState,
	metaClasses: MetaClassesState,
	objects: ObjectsState,
	states: StatesState
};
