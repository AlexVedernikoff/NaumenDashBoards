// @flow
import type {InjectedProps} from 'WidgetFormPanel/HOCs/withWidget/types';
import type {OnChange, Values} from 'components/organisms/CircleChartWidgetForm/types';

export type Props = InjectedProps & {
	onChange: OnChange,
	values: Values
};
