// @flow
import {combineReducers} from 'redux';
import layouts from './layouts/reducer';
import settings from './settings/reducer';

const dashboardReducer = combineReducers({
	layouts,
	settings
});

export default dashboardReducer;
