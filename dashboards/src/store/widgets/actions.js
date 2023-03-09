// @flow
import type {AnyWidget, Chart, SessionWidgetPart, Widget} from './data/types';
import {
	copyWidget as copyWidgetInner,
	editWidgetChunkData as editWidgetChunkDataInner,
	saveChartWidget as saveChartWidgetInner,
	saveWidget as saveWidgetInner,
	saveWidgetWithNewFilters as saveWidgetWithNewFiltersInner,
	setUseGlobalChartSettings as setUseGlobalChartSettingsInner,
	updateSessionWidget as updateSessionWidgetInner,
	updateWidget
} from './data/actions';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {DivRef} from 'components/types';
import {fetchBuildData as fetchBuildDataInner} from './buildData/actions';

const editWidgetChunkData = (widget: AnyWidget, chunkData: Object, refreshData: boolean = true): ThunkAction =>
	editWidgetChunkDataInner(widget, chunkData, fetchBuildData, refreshData);

const fetchBuildData = (widget: Widget): ThunkAction => fetchBuildDataInner(widget, editWidgetChunkData, updateWidget);

const saveChartWidget = (widget: Chart): ThunkAction => saveChartWidgetInner(widget, fetchBuildData);

const saveWidget = (widget: AnyWidget): ThunkAction => saveWidgetInner(widget, fetchBuildData);

const setUseGlobalChartSettings = (key: string, useGlobal: boolean, targetWidgetId: string = ''): ThunkAction =>
	setUseGlobalChartSettingsInner(key, useGlobal, fetchBuildData, targetWidgetId);

const copyWidget = (dashboardKey: string, widgetKey: string, relativeElement?: DivRef): ThunkAction =>
	copyWidgetInner(dashboardKey, widgetKey, fetchBuildData);

const saveWidgetWithNewFilters = (widget: Widget): ThunkAction =>
	saveWidgetWithNewFiltersInner(widget, fetchBuildData);

const updateSessionWidget = (payload: SessionWidgetPart): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		const state = getState();
		const widget = state.widgets.data.map[payload.id];

		if (widget) {
			dispatch(updateSessionWidgetInner(payload));
			dispatch(fetchBuildData(widget));
		}
	};

export {
	copyWidget,
	editWidgetChunkData,
	fetchBuildData,
	updateSessionWidget,
	saveChartWidget,
	saveWidget,
	saveWidgetWithNewFilters,
	setUseGlobalChartSettings
};
