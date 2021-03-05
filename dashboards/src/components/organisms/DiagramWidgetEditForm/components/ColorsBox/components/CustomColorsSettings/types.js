// @flow
import type {AxisWidgetType, CircleWidgetType, CustomChartColorsSettings} from 'store/widgets/data/types';

type AxisBuildData = {
	data: {
		labels: Array<string>,
		series: Array<{
			name: string
		}>
	},
	type: AxisWidgetType
};

type CircleBuildData = {
	data: {
		labels: Array<string>,
		series: Array<number>
	},
	type: CircleWidgetType
};

export type BuildData = AxisBuildData | CircleBuildData;

export type Props = {
	buildData: BuildData,
	defaultColors: Array<string>,
	onChange: (value: CustomChartColorsSettings) => void,
	value: CustomChartColorsSettings
};
