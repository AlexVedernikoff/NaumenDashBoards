// @flow
import type {AxisFormat} from 'store/widgets/data/types';
import type {DataSet as AxisDataSet} from 'store/widgetForms/axisChartForm/types';
import type {DataSet as CircleDataSet} from 'store/widgetForms/circleChartForm/types';
import type {OnChange} from 'components/organisms/AxisChartWidgetForm/types';

export type Props = {
	breakdown?: ?AxisFormat,
	data: Array<AxisDataSet> | Array<CircleDataSet>,
	onChange: OnChange
};
