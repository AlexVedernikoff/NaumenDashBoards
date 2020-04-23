// @flow
import type {AxisIndicator, AxisParameter, DataLabels, Legend} from 'store/widgets/data/types';

export type DefaultChartSettings = {
	dataLabels: DataLabels,
	legend: Legend,
	xAxis: AxisParameter,
	yAxis: AxisIndicator
};
