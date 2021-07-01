// @flow
import {combineReducers} from 'redux';
import signature from './signature/reducer';

const root = combineReducers({
	signature
});

export default root;
