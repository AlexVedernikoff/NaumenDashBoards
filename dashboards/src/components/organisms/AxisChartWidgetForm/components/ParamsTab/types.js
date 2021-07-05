// @flow
import type {BreakdownFieldsetProps} from 'WidgetFormPanel/components/ChartDataSetSettings/types';
import type {InjectedProps} from 'WidgetFormPanel/HOCs/withType/types';
import type {OnChange, Values} from 'components/organisms/AxisChartWidgetForm/types';

export type Props = InjectedProps & {
	onChange: OnChange,
	values: Values
};

export type OnChangeBreakdown = $PropertyType<BreakdownFieldsetProps, 'onChange'>;
