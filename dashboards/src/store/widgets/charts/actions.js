// @flow
import aggregate from 'utils/aggregate';
import axios from 'axios';
import buildUrl from 'utils/api';
import {CHARTS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import group from 'utils/group';
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
		const {source, xAxis, yAxis} = widget;
		const params = `'${source.value}','${xAxis.code}','${yAxis.code}'`;
		const {data: fetchedData} = await axios.post(buildUrl('dashboardTestGetData', 'getDataForDiagram', params));
		const groupType = widget.group ? widget.group.value : '';
		const dataByGroup = group(groupType, fetchedData);

		const data = aggregate(widget.aggregate.value, dataByGroup);
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
