// @flow
import diagrams from './diagrams/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';

const widgetsReducer = combineReducers({
	data,
	diagrams
});

export default widgetsReducer;
