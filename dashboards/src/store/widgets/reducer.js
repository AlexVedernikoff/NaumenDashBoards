// @flow
import buildData from './buildData/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';
import links from './links/reducer';

const widgetsReducer = combineReducers({
	buildData,
	data,
	links
});

export default widgetsReducer;
