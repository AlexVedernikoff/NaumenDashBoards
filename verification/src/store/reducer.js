// @flow
import attributes from 'store/attributes/reducer';
import {combineReducers} from 'redux';
import setting from 'store/setting/reducer';
import verification from 'store/verification/reducer';

export default combineReducers({
	attributes,
	setting,
	verification
});
