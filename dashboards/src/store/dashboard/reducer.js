// @flow
import {combineReducers} from 'redux';
import customChartColorsSettings from './customChartColorsSettings/reducer';
import layouts from './layouts/reducer';
import settings from './settings/reducer';

const dashboardReducer = combineReducers({
	customChartColorsSettings,
	layouts,
	settings
});

export default dashboardReducer;
