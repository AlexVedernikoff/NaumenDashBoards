// @flow
import {
	addWidget,
	createWidget,
	deleteWidget,
	editLayout,
	handleStatic,
	resetWidget,
	setSelectedWidget,
	updateWidget
} from './helpers';
import {defaultAction, initialWidgetsState} from './init';
import type {WidgetsAction, WidgetsDataState} from './types';
import {WIDGETS_EVENTS} from './constants';

const reducer = (state: WidgetsDataState = initialWidgetsState, action: WidgetsAction = defaultAction): WidgetsDataState => {
	switch (action.type) {
		case WIDGETS_EVENTS.SWITCH_ON_STATIC:
			return handleStatic(state, true);
		case WIDGETS_EVENTS.SWITCH_OFF_STATIC:
			return handleStatic(state, false);
		case WIDGETS_EVENTS.SET_SELECTED_WIDGET:
			return setSelectedWidget(state, action);
		case WIDGETS_EVENTS.RESET_WIDGET:
			return resetWidget(state);
		case WIDGETS_EVENTS.ADD_WIDGET:
			return addWidget(state, action);
		case WIDGETS_EVENTS.SET_CREATED_WIDGET:
			return createWidget(state, action);
		case WIDGETS_EVENTS.UPDATE_WIDGET:
			return updateWidget(state, action);
		case WIDGETS_EVENTS.DELETE_WIDGET:
			return deleteWidget(state, action);
		case WIDGETS_EVENTS.EDIT_LAYOUT:
			return editLayout(state, action);
		default:
			return state;
	}
};

export default reducer;
