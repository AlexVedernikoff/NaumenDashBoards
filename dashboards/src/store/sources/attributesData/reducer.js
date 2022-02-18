// @flow
import catalogItemSets from './catalogItemSets/reducer';
import catalogItems from './catalogItems/reducer';
import {combineReducers} from 'redux';
import groupsAttributes from './groupsAttributes/reducer';
import metaClasses from './metaClasses/reducer';
import objects from './objects/reducer';
import states from './states/reducer';

const attributesDataReducer = combineReducers({
	catalogItemSets,
	catalogItems,
	groupsAttributes,
	metaClasses,
	objects,
	states
});

export default attributesDataReducer;
