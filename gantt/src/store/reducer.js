// @flow
import app from 'store/App/reducer';
import {combineReducers} from 'redux';

export const NameSpace = {
	APP: 'APP'
};

export default combineReducers({
	[NameSpace.APP]: app
});
