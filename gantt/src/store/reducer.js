// @flow
import app from 'store/App/reducer';
import attributes from 'store/attributes/reducer';
import {combineReducers} from 'redux';

export const NameSpace = {
	APP: 'APP',
	ATTRIBUTES: 'ATTRIBUTES'
};

export default combineReducers({
	[NameSpace.APP]: app,
	[NameSpace.ATTRIBUTES]: attributes

});
