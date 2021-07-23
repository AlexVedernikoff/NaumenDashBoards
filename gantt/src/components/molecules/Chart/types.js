// @flow
import type {Chart} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

export type Props = {
	data: DiagramBuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings,
	widget: Chart
};
