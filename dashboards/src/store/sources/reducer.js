// @flow
import attributes from './attributes/reducer';
import attributesData from './attributesData/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';
import refAttributes from './refAttributes/reducer';

const sourcesReducer = combineReducers({
	attributes,
	attributesData,
	data,
	refAttributes
});

export default sourcesReducer;
