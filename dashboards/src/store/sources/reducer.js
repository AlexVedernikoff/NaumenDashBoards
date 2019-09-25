// @flow
import attributes from './attributes/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';

const sourcesReducer = combineReducers({
	attributes,
	data
});

export default sourcesReducer;
