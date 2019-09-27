// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';
import {defaultAction, initialDashboardState} from './init';

/**
 * Функция сохранения изменения положения виджета
 * @param state - Текущий state
 * @param action - Вызываемый action
 * @returns {state} - Новый объект state, который включает измененные координаты найденного виджета в массиве виджетов
*/
const editLayout = (action: DashboardAction, state: DashboardState): DashboardState => {
	state.widgets.forEach(w => {
		const newLayout = action.payload.find(l => l.i === w.id);
		if (newLayout) w.layout = newLayout;
	});
	return state;
};

/**
 * Функция обновления информации о редактируемом виджете
 * @param state - Текущий state
 * @param action - Вызываемый action
 * @returns {state} - Новый объект state, который включает измененные данные найденного виджета в массиве виджетов
*/
const updateWidget = (action: DashboardAction, state: DashboardState): DashboardState => (
	{
		...state,
		widgets: state.widgets.map(w => {
			if (w.id === state.editedWidgetId) {
				return {
					...w,
					...action.payload
				};
			}
			return w;
		})
	}
);

const reducer = (state: DashboardState = initialDashboardState, action: DashboardAction = defaultAction): DashboardState => {
	switch (action.type) {
		case DASHBOARD_EVENTS.ADD_WIDGET:
			return {
				...state,
				widgets: [...state.widgets, action.payload]
			};
		case DASHBOARD_EVENTS.CLOSE_WIDGET_PANEL:
			return {
				...state,
				editedWidgetId: null
			};
		case DASHBOARD_EVENTS.EDIT_WIDGET:
			return {
				...state,
				editedWidgetId: action.payload
			};
		case DASHBOARD_EVENTS.EDIT_LAYOUT:
			return editLayout(action, state);
		case DASHBOARD_EVENTS.UPDATE_WIDGET:
			return updateWidget(action, state);
		default:
			return state;
	}
};

export default reducer;
