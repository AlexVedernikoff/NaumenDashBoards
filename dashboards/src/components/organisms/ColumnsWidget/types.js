// @flow
import type {AxisChartOptions} from 'utils/recharts/types';
import type {AxisTooltip} from 'components/molecules/RechartTooltip/types';
import type {Chart} from 'store/widgets/data/types';
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';
import type {InjectedProps as LabelsStorageProps} from 'containers/LabelsStorage/types';

export type Props = InjectOptionsProps & LabelsStorageProps & {
	widget: Chart
};

export type State = {
	options: $Shape<AxisChartOptions>,
	tooltip: AxisTooltip | null
};
