// @flow
import {CHARTS_EVENTS} from './constants';
import type {XAxis, YAxis} from 'utils/aggregate/types';

export type ChartData = {
	xAxis: XAxis,
	yAxis: YAxis
};

export type Chart = {
	data?: ChartData,
	error: boolean,
	loading: boolean
};

export type ChartMap = {
	[key: string]: Chart
};

export type ReceiveChartPayload = {
	data: ChartData,
	id: string
};

export type RequestChart = {
	type: typeof CHARTS_EVENTS.REQUEST_CHART,
	payload: string
};

export type ReceiveChart = {
	type: typeof CHARTS_EVENTS.RECEIVE_CHART,
	payload: ReceiveChartPayload
};

export type RecordErrorChart = {
	type: typeof CHARTS_EVENTS.RECORD_CHART_ERROR,
	payload: string
};

type UnknownChartsAction = {
	type: typeof CHARTS_EVENTS.UNKNOWN_CHARTS_ACTION
};

export type ChartsAction =
	| RequestChart
	| ReceiveChart
	| RecordErrorChart
	| UnknownChartsAction
;

export type ChartsState = {
	map: ChartMap
};
