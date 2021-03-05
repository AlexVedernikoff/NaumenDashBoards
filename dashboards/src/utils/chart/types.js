// @flow
import type {AxisSettings, DataLabels, Legend, LegendPosition} from 'store/widgets/data/types';

export type DefaultChartSettings = {
	axis: AxisSettings,
	dataLabels: DataLabels,
	legend: Legend
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

export type ApexLabels = $ReadOnlyArray<string> | $ReadOnlyArray<Array<string>>;

export type AxisProps = {
	name: string,
	show: boolean,
	showName: boolean
};

export type Options = Object;

export type Series = Array<any>;
