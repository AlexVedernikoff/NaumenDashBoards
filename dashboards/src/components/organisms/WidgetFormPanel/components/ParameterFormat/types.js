// @flow
import type {AxisSettings} from 'store/widgets/data/types';
import type {DataSet as AxisDataSet} from 'store/widgetForms/axisChartForm/types';
import type {OnChange} from 'components/organisms/AxisChartWidgetForm/types';

export type Props = {
	data: Array<AxisDataSet>,
	onChange: OnChange,
	parameter: AxisSettings
};
