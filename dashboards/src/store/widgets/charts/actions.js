// @flow
import {buildUrl, client} from 'utils/api';
import {CHARTS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {DEFAULT_GROUP} from 'utils/group';
import type {ReceiveChartPayload} from './types';
import type {Widget} from 'store/widgets/data/types';

/**
 * Получаем данные графика для конкретного виджета
 * @param {Widget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchChartData = (widget: Widget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestChart(widget.id));

	try {
		const {aggregate, source, xAxis, yAxis} = widget;
		const params = `'${source.value}','${xAxis.code}','${yAxis.code}','${aggregate.value}','${DEFAULT_GROUP}'`;
		const {data} = await client.post(buildUrl('dashboardDataSet', 'getDataForDiagram', params));

		dispatch(
			receiveChart({data, id: widget.id})
		);
	} catch (e) {
		dispatch(recordChartError(widget.id));
	}
};

const requestChart = (payload: string) => ({
	type: CHARTS_EVENTS.REQUEST_CHART,
	payload
});

const receiveChart = (payload: ReceiveChartPayload) => ({
	type: CHARTS_EVENTS.RECEIVE_CHART,
	payload
});

const recordChartError = (payload: string) => ({
	type: CHARTS_EVENTS.RECORD_CHART_ERROR,
	payload
});

export {
	fetchChartData
};
