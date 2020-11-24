// @flow
import type {ActionType, CalendarSelectorsState} from './types';
import {CALENDAR_SELECTORS_EVENTS} from './constants';
import {initialState} from './init';

const reducer = (
	state: CalendarSelectorsState = initialState,
	{type, payload}: ActionType
): CalendarSelectorsState => {
	switch (type) {
		case CALENDAR_SELECTORS_EVENTS.SET_CALENDAR_LIST:
			return {
				...state,
				calendarList: payload
			};
		case CALENDAR_SELECTORS_EVENTS.SET_CALENDAR_LIST_LOADING:
			return {
				...state,
				isLoading: payload
			};
		case CALENDAR_SELECTORS_EVENTS.SET_ERROR:
			return {
				...state,
				error: payload
			};
		case CALENDAR_SELECTORS_EVENTS.SET_LOCATION_LIST:
			return {
				...state,
				locationList: payload
			};
		case CALENDAR_SELECTORS_EVENTS.SET_LOCATION_LIST_LOADING:
			return {
				...state,
				isLoading: payload
			};
		case CALENDAR_SELECTORS_EVENTS.SET_SELECTED_OPTION: {
			const {data, fieldName} = payload;
			return {
				...state,
				selectedOptions: {
					...state.selectedOptions,
					[fieldName]: data
				}
			};
		}
		default:
			return state;
	}
};

export default reducer;
