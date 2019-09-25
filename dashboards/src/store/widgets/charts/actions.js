// @flow
import aggregate from 'utils/aggregate';
import axios from 'axios';
import {BASE_URL, KEY} from 'constants/api';
import {CHARTS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {FormData} from 'components/organisms/WidgetFormPanel/types';
import group from 'utils/group';
import type {ReceiveChartPayload} from './types';

/**
 * Получаем данные графика для конкретного виджета
 * @param {FormData} formData - данные формы редактирования\создания виджета
 * @param {string} id - id виджета
 * @returns {ThunkAction}
 */
const fetchChartData = (formData: FormData, id: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {source, xAxis, yAxis} = formData;
		dispatch(requestChart(id));

		const {data: fetchedData} = await axios.post(`${BASE_URL}/exec-post?func=modules.dashboards.getDataForDiagram&accessKey=${KEY}&params='${source.value}','${xAxis.code}','${yAxis.code}'`);
		const groupType = formData.group ? formData.group.value : '';
		const dataByGroup = group(groupType, fetchedData);

		const data = aggregate(formData.aggregate.value, dataByGroup);

		dispatch(
			receiveChart({data, id})
		);
	} catch (e) {
		dispatch(recordChartError(id));
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
