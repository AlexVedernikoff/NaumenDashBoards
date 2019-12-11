// @flow
import {
	addWidget,
	createWidget,
	deleteWidget,
	editLayout,
	resetWidget,
	setSelectedWidget,
	setWidgets,
	updateWidget
} from './helpers';
import {defaultAction, initialWidgetsState} from './init';
import type {WidgetsAction, WidgetsDataState} from './types';
import {WIDGETS_EVENTS} from './constants';

const reducer = (state: WidgetsDataState = initialWidgetsState, action: WidgetsAction = defaultAction): WidgetsDataState => {
	switch (action.type) {
		case WIDGETS_EVENTS.ADD_WIDGET:
			return addWidget(state, action);
		case WIDGETS_EVENTS.DELETE_WIDGET:
			return deleteWidget(state, action);
		case WIDGETS_EVENTS.EDIT_LAYOUT:
			return editLayout(state, action);
		case WIDGETS_EVENTS.RECORD_LAYOUT_SAVE_ERROR:
			return {
				...state,
				layoutSaveError: true
			};
		case WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR:
			return {
				...state,
				deleteError: true,
				deleting: false
			};
		case WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR:
			return {
				...state,
				saveError: true,
				updating: false
			};
		case WIDGETS_EVENTS.REQUEST_LAYOUT_SAVE:
			return {
				...state,
				layoutSaveError: false
			};
		case WIDGETS_EVENTS.REQUEST_WIDGET_DELETE:
			return {
				...state,
				deleteError: false,
				deleting: true
			};
		case WIDGETS_EVENTS.REQUEST_WIDGET_SAVE:
			return {
				...state,
				saveError: false,
				updating: true
			};
		case WIDGETS_EVENTS.RESET_WIDGET:
			return resetWidget(state);
		case WIDGETS_EVENTS.SET_CREATED_WIDGET:
			return createWidget(state, action);
		case WIDGETS_EVENTS.SET_SELECTED_WIDGET:
			return setSelectedWidget(state, action);
		case WIDGETS_EVENTS.SET_WIDGETS:
			return setWidgets(state, action);
		case WIDGETS_EVENTS.UPDATE_WIDGET:
			return updateWidget(state, action);
		default:
			return state;
	}
};

export default reducer;
