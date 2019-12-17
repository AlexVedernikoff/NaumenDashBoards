// @flow
import {combineReducers} from 'redux';
import dashboard from './dashboard/reducer';
import sources from './sources/reducer';
import toasts from './toasts/reducer';
import widgets from './widgets/reducer';

const createRootReducer = () => combineReducers({
	dashboard,
	sources,
	toasts,
	widgets
});

export default createRootReducer;
