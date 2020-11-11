// @flow
import type {AxisIndicator, AxisParameter, DataLabels, Legend, LegendPosition} from 'store/widgets/data/types';

export type DefaultChartSettings = {
	dataLabels: DataLabels,
	legend: Legend,
	xAxis: AxisParameter,
	yAxis: AxisIndicator
};

export type ApexLegend = {
	fontFamily: string,
	fontSize: string | number,
	formatter: (legendName: string, opts?: any) => string,
	height?: number,
	offsetX?: number,
	offsetY?: number,
	position: LegendPosition,
	show: boolean,
	showForSingleSeries: boolean,
	width: number
};
