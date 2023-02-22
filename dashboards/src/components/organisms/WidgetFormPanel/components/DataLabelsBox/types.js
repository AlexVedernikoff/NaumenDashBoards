// @flow
import type {AnyWidget, AxisFormat, DataLabels} from 'store/widgets/data/types';
import type {DataSet as AxisDataSet} from 'store/widgetForms/axisChartForm/types';
import type {DataSet as CircleDataSet} from 'store/widgetForms/circleChartForm/types';
import type {DataSet as ComboDataSet} from 'store/widgetForms/comboChartForm/types';
import NewWidget from 'store/widgets/data/NewWidget';

export type SomeDataSets = Array<CircleDataSet> | Array<ComboDataSet> | Array<AxisDataSet>;

export type IndicatorFormat = {
	dataSetIndex: number,
	format: AxisFormat,
	indicatorIndex: number,
	title: string
};

export type DefaultProps = {
	name: string,
	showFormat: 'single' | 'multiple',
};

export type Props = {
	...DefaultProps,
	data: SomeDataSets,
	onChange: (name: string, value: DataLabels, callback?: Function) => void,
	onChangeData: (data: SomeDataSets) => void,
	value: DataLabels,
	value: DataLabels,
	widget: AnyWidget | NewWidget
};

export type ComponentProps = React$Config<Props, DefaultProps>;
