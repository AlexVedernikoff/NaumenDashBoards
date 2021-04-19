// @flow
import type {Chart} from 'store/widgets/data/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

export type ConnectedProps = {
	globalColorsSettings: GlobalCustomChartColorsSettings
};

export type Props = ConnectedProps & {
	widget: Chart
};
