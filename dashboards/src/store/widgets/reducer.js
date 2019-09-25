// @flow
import charts from './charts/reducer';
import {combineReducers} from 'redux';
import data from './data/reducer';

const widgetsReducer = combineReducers({
	charts,
	data
});

export default widgetsReducer;
