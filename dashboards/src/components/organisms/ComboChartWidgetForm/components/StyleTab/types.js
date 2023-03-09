// @flow
import type {InjectedProps} from 'WidgetFormPanel/HOCs/withWidget/types';
import type {OnChange, Values} from 'components/organisms/ComboChartWidgetForm/types';

export type Props = InjectedProps & {
	onChange: OnChange,
	values: Values
};

export type XAxisNameContext = {
	mainIndex: number,
	xAxisName: string
};
