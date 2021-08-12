// @flow
import type {AppState} from 'store/types';
import type {BuildDataState, DiagramData} from 'store/widgets/buildData/types';
import {createSelector} from 'reselect';
import {getMapValues} from 'helpers';
import type {Widget, WidgetsDataState} from 'store/widgets/data/types';

/**
 * Возвращает данные состояния хранилища виджетов
 * @param {AppState} state - состояние хранилища
 * @returns {WidgetsDataState}
 */
const getWidgetsData = (state: AppState): WidgetsDataState => state.widgets.data;

/**
 * Возвращает данные для построения всех виджетов
 * @param {AppState} state - состояние хранилища
 * @returns {BuildDataState}
 */
const getWidgetsBuildData = (state: AppState): BuildDataState => state.widgets.buildData;

/**
 * Возвращает данные для построения виджета
 * @param {AppState} state - состояние хранилища
 * @param {Widget} widget - виджет
 * @returns {BuildDataState}
 */
const getWidgetBuildData = (state: AppState, widget: Widget): DiagramData => {
	const {[widget.id]: data = {
		data: null,
		error: false,
		loading: false,
		type: widget.type,
		updating: false
	}} = getWidgetsBuildData(state);

	return data;
};

/**
 * Возвращает id редактируемого виджета
 * @param {AppState} state - состояние хранилища
 * @returns {string}
 */
const getSelectedWidgetId = (state: AppState): string => state.widgets.data.selectedWidget;

/**
 * Возвращает метаданные редактируемого виджета
 */
const getSelectedWidget = createSelector(
	[getWidgetsData, getSelectedWidgetId],
	(widgetsData: WidgetsDataState, widgetId: string): Widget => widgetsData.map[widgetId]
);

/**
 * Возвращает метанные всех виджетов
 */
const getAllWidgets = createSelector(
	getWidgetsData,
	(data: WidgetsDataState): Widget[] => {
		return getMapValues(data.map);
	}
);

/**
 * Возвращает метанные всех виджетов без выбранного для редактирования
 */
const getAllWidgetsWithoutSelected = createSelector(
	getAllWidgets,
	getSelectedWidgetId,
	(widgets: Widget[], selected: string): Widget[] => widgets.filter(widget => widget.id !== selected)
);

/**
 * Возвращает данные для построения редактируемого виджета
 */
const getSelectedWidgetBuildData = createSelector(
	[getWidgetsBuildData, getSelectedWidgetId],
	(buildData: BuildDataState, widgetId: string): DiagramData => buildData[widgetId]
);

/**
 * Возвращает данные для построения всех виджетов
 */
const getAllWidgetsBuildData = createSelector(
	getWidgetsBuildData,
	(data: BuildDataState): DiagramData[] => getMapValues(data)
);

export {
	getAllWidgetsBuildData,
	getAllWidgets,
	getAllWidgetsWithoutSelected,
	getSelectedWidget,
	getSelectedWidgetBuildData,
	getSelectedWidgetId,
	getWidgetBuildData,
	getWidgetsBuildData
};
