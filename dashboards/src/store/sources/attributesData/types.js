// @flow
import type {CatalogItemSetsState} from './catalogItemSets/types';
import type {CatalogItemsState} from './catalogItems/types';
import type {GroupsAttributesState} from './groupsAttributes/types';
import type {MetaClassesState} from './metaClasses/types';
import type {ObjectsState} from './objects/types';
import type {StatesState} from './states/types';

export type AttributesDataState = {
	catalogItems: CatalogItemsState,
	catalogItemSets: CatalogItemSetsState,
	groupsAttributes: GroupsAttributesState,
	metaClasses: MetaClassesState,
	objects: ObjectsState,
	states: StatesState
};
