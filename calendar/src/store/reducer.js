// @flow
import calendarSelectors from './CalendarSelectors/reducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	calendarSelectors
});

export default rootReducer;
