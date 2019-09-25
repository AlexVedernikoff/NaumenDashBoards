// @flow
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import dashboard from './dashboard/reducer';
import type {History} from 'history';
import sources from './sources/reducer';
import widgets from './widgets/reducer';

const createRootReducer = (history: History) => combineReducers({
	dashboard,
	router: connectRouter(history),
	sources,
	widgets
});

export default createRootReducer;
