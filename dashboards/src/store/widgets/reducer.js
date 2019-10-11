// @flow
import diagrams from './diagrams/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';
import links from './links/reducer';

const widgetsReducer = combineReducers({
	data,
	diagrams,
	links
});

export default widgetsReducer;
