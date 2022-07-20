// @flow
import attributes from './attributes/reducer';
import attributesData from './attributesData/reducer';
import {combineReducers} from 'redux';
import currentObject from './currentObject/reducer';
import data from './data/reducer';
import dynamicGroups from './dynamicGroups/reducer';
import linkedAttributes from './linkedAttributes/reducer';
import linkedData from './linkedData/reducer';
import refAttributes from './refAttributes/reducer';
import sourcesFilters from './sourcesFilters/reducer';

const sourcesReducer = combineReducers({
	attributes,
	attributesData,
	currentObject,
	data,
	dynamicGroups,
	linkedAttributes,
	linkedData,
	refAttributes,
	sourcesFilters
});

export default sourcesReducer;
