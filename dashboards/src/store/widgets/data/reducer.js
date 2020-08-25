// @flow
import {
	addWidget,
	createWidget,
	deleteWidget,
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
		case WIDGETS_EVENTS.RECORD_VALIDATE_TO_COPY_ERROR:
			return {
				...state,
				validatingToCopy: {
					error: true,
					loading: false
				}
			};
		case WIDGETS_EVENTS.RECORD_WIDGET_COPY_ERROR:
			return {
				...state,
				copying: {
					error: true,
					loading: false
				}
			};
		case WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR:
			return {
				...state,
				deleting: {
					error: true,
					loading: false
				}
			};
		case WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR:
			return {
				...state,
				saving: {
					error: true,
					loading: false
				}
			};
		case WIDGETS_EVENTS.REQUEST_VALIDATE_TO_COPY:
			return {
				...state,
				validatingToCopy: {
					error: false,
					loading: true
				}
			};
		case WIDGETS_EVENTS.REQUEST_WIDGET_COPY:
			return {
				...state,
				copying: {
					error: false,
					loading: true
				}
			};
		case WIDGETS_EVENTS.REQUEST_WIDGET_DELETE:
			return {
				...state,
				deleting: {
					error: false,
					loading: true
				}
			};
		case WIDGETS_EVENTS.REQUEST_WIDGET_SAVE:
			return {
				...state,
				saving: {
					error: false,
					loading: true
				}
			};
		case WIDGETS_EVENTS.RESET_WIDGET:
			return resetWidget(state);
		case WIDGETS_EVENTS.RESPONSE_VALIDATE_TO_COPY:
			return {
				...state,
				validatingToCopy: {
					...state.validatingToCopy,
					loading: false
				}
			};
		case WIDGETS_EVENTS.RESPONSE_WIDGET_COPY:
			return {
				...state,
				copying: {
					...state.copying,
					loading: false
				}
			};
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
