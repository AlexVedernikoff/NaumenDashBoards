// @flow
import type {Chart} from 'store/widgets/data/types';
import type {CircleChartOptions} from 'utils/recharts/types';
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';

export type Props = InjectOptionsProps & {
	widget: Chart
};

export type State = {
	options: $Shape<CircleChartOptions>,
	tooltipColor: string
};
