// @flow
import {addLayouts, changeLayouts, removeLayouts, replaceLayoutsId} from './helpers';
import {defaultLayoutsAction, initialLayoutsState} from './init';
import type {LayoutsAction, LayoutsState} from './types';
import {LAYOUTS_EVENTS} from './constants';
import NewWidget from 'store/widgets/data/NewWidget';

const reducer = (state: LayoutsState = initialLayoutsState, action: LayoutsAction = defaultLayoutsAction): LayoutsState => {
	switch (action.type) {
		case LAYOUTS_EVENTS.ADD_LAYOUTS:
			return addLayouts(removeLayouts(state, NewWidget.id), NewWidget.id);
		case LAYOUTS_EVENTS.CHANGE_LAYOUTS:
			return changeLayouts(state, action.payload);
		case LAYOUTS_EVENTS.REMOVE_LAYOUTS:
			return removeLayouts(state, action.payload);
		case LAYOUTS_EVENTS.REPLACE_LAYOUTS_ID:
			return replaceLayoutsId(state, action.payload);
		case LAYOUTS_EVENTS.REQUEST_SAVE_LAYOUTS:
			return {
				...state,
				error: false,
				loading: true
			};
		case LAYOUTS_EVENTS.RESPONSE_SAVE_LAYOUTS:
			return {
				...state,
				loading: false
			};
		case LAYOUTS_EVENTS.RECORD_SAVE_LAYOUTS_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		default:
			return state;
	}
};

export default reducer;
