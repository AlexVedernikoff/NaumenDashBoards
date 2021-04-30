// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import {BUILD_DATA_EVENTS} from './constants';
import {DIAGRAM_WIDGET_TYPES, DISPLAY_MODE} from 'store/widgets/data/constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getWidgetFilterOptionsDescriptors} from './helpers';
import type {ReceiveBuildDataPayload} from './types';

/**
 * Получаем данные графиков для всех виджетов
 * @param {Array<AnyWidget>} widgets - список виджетов
 * @returns {ThunkAction}
 */
const fetchAllBuildData = (widgets: Array<AnyWidget>): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {layoutMode} = getState().dashboard.settings;
	const filteredWidgets = widgets.filter(item => (item.displayMode === layoutMode || item.displayMode === DISPLAY_MODE.ANY));

	filteredWidgets.forEach(widget => dispatch(fetchBuildData(widget)));
};

/**
 * Получаем данные графика для конкретного виджета
 * @param {AnyWidget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchBuildData = (widget: AnyWidget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	if (widget.type in DIAGRAM_WIDGET_TYPES) {
		dispatch(requestBuildData(widget));

		try {
			const {context, dashboard} = getState();
			const widgetFilters = getWidgetFilterOptionsDescriptors(widget);
			const ignoreDataLimits = {breakdown: false, parameter: false, ...(widget.ignoreDataLimits || {})};

			const data = await window.jsApi.restCallModule(
				'dashboardDataSet',
				'getDataForCompositeDiagram',
				dashboard.settings.code,
				widget.id,
				context.subjectUuid,
				ignoreDataLimits,
				widgetFilters
			);

			dispatch(
				receiveBuildData({data, id: widget.id})
			);
		} catch (e) {
			dispatch(recordBuildDataError(widget.id));
		}
	}
};

const receiveBuildData = (payload: ReceiveBuildDataPayload) => ({
	payload,
	type: BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA
});

const recordBuildDataError = (payload: string) => ({
	payload,
	type: BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR
});

const requestBuildData = (payload: AnyWidget) => ({
	payload,
	type: BUILD_DATA_EVENTS.REQUEST_BUILD_DATA
});

export {
	fetchBuildData,
	fetchAllBuildData
};
