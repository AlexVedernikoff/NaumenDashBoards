// @flow
import {combineReducers} from 'redux';
import metaClasses from './metaClasses/reducer';
import states from './states/reducer';

const attributesDataReducer = combineReducers({
	metaClasses,
	states
});

export default attributesDataReducer;
