// @flow
import type {AxisChartOptions} from 'utils/recharts/types';
import type {AxisTooltip} from 'components/molecules/RechartTooltip/types';
import type {Chart} from 'store/widgets/data/types';
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';

export type Props = InjectOptionsProps & {
	widget: Chart
};

export type State = {
	options: $Shape<AxisChartOptions>,
	tooltip: AxisTooltip | null
};
