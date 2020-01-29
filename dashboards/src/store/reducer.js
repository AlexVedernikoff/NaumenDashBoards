// @flow
import {combineReducers} from 'redux';
import customGroups from './customGroups/reducer';
import dashboard from './dashboard/reducer';
import sources from './sources/reducer';
import toasts from './toasts/reducer';
import widgets from './widgets/reducer';

const createRootReducer = () => combineReducers({
	customGroups,
	dashboard,
	sources,
	toasts,
	widgets
});

export default createRootReducer;
