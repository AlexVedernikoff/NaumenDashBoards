// @flow
import attributes from './attributes/reducer';
import attributesData from './attributesData/reducer';
import {combineReducers} from 'redux';
import currentObject from './currentObject/reducer';
import data from './data/reducer';
import dynamicGroups from './dynamicGroups/reducer';
import refAttributes from './refAttributes/reducer';

const sourcesReducer = combineReducers({
	attributes,
	attributesData,
	currentObject,
	data,
	dynamicGroups,
	refAttributes
});

export default sourcesReducer;
