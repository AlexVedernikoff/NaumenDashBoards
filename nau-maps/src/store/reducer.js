// @flow
import {combineReducers} from 'redux';
import geolocation from './geolocation/reducer';

export const root = combineReducers({
	geolocation
});

export default root;
