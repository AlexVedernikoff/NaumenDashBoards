// @flow
import type {AnyWidget, Chart, Widget} from './data/types';
import {
	copyWidget as copyWidgetInner,
	editWidgetChunkData as editWidgetChunkDataInner,
	saveChartWidget as saveChartWidgetInner,
	saveWidget as saveWidgetInner,
	saveWidgetWithNewFilters as saveWidgetWithNewFiltersInner,
	setUseGlobalChartSettings as setUseGlobalChartSettingsInner,
	updateWidget
} from './data/actions';
import {fetchBuildData as fetchBuildDataInner} from './buildData/actions';
import type {ThunkAction} from 'store/types';

const editWidgetChunkData = (widget: AnyWidget, chunkData: Object, refreshData: boolean = true): ThunkAction =>
	editWidgetChunkDataInner(widget, chunkData, fetchBuildData, refreshData);

const fetchBuildData = (widget: Widget): ThunkAction => fetchBuildDataInner(widget, editWidgetChunkData, updateWidget);

const saveChartWidget = (widget: Chart): ThunkAction => saveChartWidgetInner(widget, fetchBuildData);

const saveWidget = (widget: AnyWidget): ThunkAction => saveWidgetInner(widget, fetchBuildData);

const setUseGlobalChartSettings = (key: string, useGlobal: boolean, targetWidgetId: string = ''): ThunkAction =>
	setUseGlobalChartSettingsInner(key, useGlobal, fetchBuildData, targetWidgetId);

const copyWidget = (dashboardKey: string, widgetKey: string): ThunkAction =>
	copyWidgetInner(dashboardKey, widgetKey, fetchBuildData);

const saveWidgetWithNewFilters = (widget: Widget): ThunkAction =>
	saveWidgetWithNewFiltersInner(widget, fetchBuildData);

export {
	copyWidget,
	editWidgetChunkData,
	fetchBuildData,
	saveChartWidget,
	saveWidget,
	saveWidgetWithNewFilters,
	setUseGlobalChartSettings
};
