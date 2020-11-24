// @flow
import app from './App/reducer';
import calendar from './Calendar/reducer';
import calendarSelectors from './CalendarSelectors/reducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	app,
	calendar,
	calendarSelectors
});

export default rootReducer;
