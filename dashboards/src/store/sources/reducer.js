// @flow
import attributes from './attributes/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';
import refAttributes from './refAttributes/reducer';

const sourcesReducer = combineReducers({
	attributes,
	data,
	refAttributes
});

export default sourcesReducer;
