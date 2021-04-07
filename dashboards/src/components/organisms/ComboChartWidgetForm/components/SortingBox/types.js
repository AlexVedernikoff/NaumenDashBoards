// @flow
import type {DataSet} from 'store/widgetForms/comboChartForm/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SortingBox/types';

export type Props = ComponentProps & {
	data: Array<DataSet>
};
