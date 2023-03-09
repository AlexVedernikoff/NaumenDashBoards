// @flow
import type {AppState} from 'store/types';
import type {BuildDataState, DiagramData} from 'store/widgets/buildData/types';
import {createSelector} from 'reselect';
import {getMapValues} from 'helpers';
import type {SessionWidgetMap, SessionWidgetPart, Widget, WidgetsDataState} from './types';
import {uniteWidgetWithSession} from './helpers';

/**
 * Возвращает данные состояния хранилища виджетов
 * @param {AppState} state - состояние хранилища
 * @returns {WidgetsDataState}
 */
const getWidgetsData = (state: AppState): WidgetsDataState => state.widgets.data;

/**
 * Возвращает временное состояния хранилища виджетов
 * @param {AppState} state - состояние хранилища
 * @returns {WidgetsDataState}
 */
const getSessionWidgetPart = (state: AppState) => state.widgets.data.sessionData;

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
		error: null,
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
 * Возвращает метаданные редактируемого виджета
 */
const getFullSelectedWidget = createSelector(
	[
		getSelectedWidget,
		getSessionWidgetPart
	],
	(widget: Widget, sessionData: SessionWidgetMap): Widget => {
		const {id} = widget;
		const session = sessionData[id];

		return uniteWidgetWithSession(widget, session);
	}
);

/**
 * Возвращает метанные всех виджетов
 */
const getAllWidgets = createSelector(
	getWidgetsData,
	(data: WidgetsDataState): Widget[] => getMapValues(data.map)
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

const getAllFullWidgets = createSelector(
	[
		getAllWidgets,
		getSessionWidgetPart
	],
	(widgets: Widget[], sessionData: SessionWidgetMap): Widget[] =>
		widgets.map((widget: Widget) => uniteWidgetWithSession(widget, sessionData[widget.id]))
);

/**
 * Возвращает временные данные виджета
 * @param {AppState} state - состояние хранилища
 * @param {string} id - идентификатор виджета
 * @returns {WidgetsDataState}
 */
const getWidgetSessionData = (state: AppState, id: string): SessionWidgetPart => state.widgets.data.sessionData[id] ?? {id};

/**
 * Возвращает полную информацию по виджету
 * @param {AppState} state - состояние хранилища
 * @param {string} id - идентификатор виджета
 * @returns {Widget}
 */
const getFullWidgetData = createSelector(
	[
		getWidgetsData,
		(state, id: string) => id
	],
	(data: WidgetsDataState, id: string): Widget => {
		const widget = data.map[id];
		const widgetSession = data.sessionData[id];

		return uniteWidgetWithSession(widget, widgetSession);
	}
);

export {
	getAllFullWidgets,
	getAllWidgets,
	getAllWidgetsBuildData,
	getAllWidgetsWithoutSelected,
	getFullSelectedWidget,
	getFullWidgetData,
	getSelectedWidget,
	getSelectedWidgetBuildData,
	getSelectedWidgetId,
	getSessionWidgetPart,
	getWidgetBuildData,
	getWidgetsBuildData,
	getWidgetSessionData
};
