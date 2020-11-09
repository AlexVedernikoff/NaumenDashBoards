// @flow
import calendar from './Calendar/reducer';
import calendarSelectors from './CalendarSelectors/reducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	calendar,
	calendarSelectors
});

export default rootReducer;
