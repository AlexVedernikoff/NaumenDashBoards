// @flow
import {
	addWidget,
	clearWidgetWarning,
	createWidget,
	deleteWidget,
	resetWidget,
	setSelectedWidget,
	setWidgetWarning,
	setWidgets,
	updateWidget
} from './helpers';
import {defaultAction, initialWidgetsState} from './init';
import type {WidgetsAction, WidgetsDataState} from './types';

const reducer = (state: WidgetsDataState = initialWidgetsState, action: WidgetsAction = defaultAction): WidgetsDataState => {
	switch (action.type) {
		case 'widgets/data/addWidget':
			return addWidget(state, action);
		case 'widgets/data/deleteWidget':
			return deleteWidget(state, action);
		case 'widgets/data/recordValidateToCopyError':
			return {
				...state,
				validatingToCopy: {
					error: true,
					loading: false
				}
			};
		case 'widgets/data/recordWidgetCopyError':
			return {
				...state,
				copying: {
					error: true,
					loading: false
				}
			};
		case 'widgets/data/recordWidgetDeleteError':
			return {
				...state,
				deleting: {
					error: true,
					loading: false
				}
			};
		case 'widgets/data/recordWidgetSaveError':
			return {
				...state,
				saving: {
					error: true,
					loading: false
				}
			};
		case 'widgets/data/requestValidateToCopy':
			return {
				...state,
				validatingToCopy: {
					error: false,
					loading: true
				}
			};
		case 'widgets/data/requestWidgetCopy':
			return {
				...state,
				copying: {
					error: false,
					loading: true
				}
			};
		case 'widgets/data/requestWidgetDelete':
			return {
				...state,
				deleting: {
					error: false,
					loading: true
				}
			};
		case 'widgets/data/requestWidgetSave':
			return {
				...state,
				saving: {
					error: false,
					loading: true
				}
			};
		case 'widgets/data/resetFocusedWidget':
			return {
				...state,
				focusedWidget: ''
			};
		case 'widgets/data/resetWidget':
			return resetWidget(state);
		case 'widgets/data/responseValidateToCopy':
			return {
				...state,
				validatingToCopy: {
					...state.validatingToCopy,
					loading: false
				}
			};
		case 'widgets/data/responseWidgetCopy':
			return {
				...state,
				copying: {
					...state.copying,
					loading: false
				}
			};
		case 'widgets/data/setCreatedWidget':
			return createWidget(state, action);
		case 'widgets/data/setFocusedWidget':
			return {
				...state,
				focusedWidget: action.payload
			};
		case 'widgets/data/setSelectedWidget':
			return setSelectedWidget(state, action);
		case 'widgets/data/setWidgets':
			return setWidgets(state, action);
		case 'widgets/data/updateWidget':
			return updateWidget(state, action);
		case 'widgets/data/widgetSetWarning':
			return setWidgetWarning(state, action);
		case 'widgets/data/widgetClearWarning':
			return clearWidgetWarning(state, action);
		default:
			return state;
	}
};

export default reducer;
