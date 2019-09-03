// @flow
import {combineReducers} from 'redux';
import dashboard from './dashboard/reducer';

const root = combineReducers({
	dashboard
});

export default root;
