// @flow
import type {DrillDown} from 'store/widgets/links/types';
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';
import type {SummaryWidget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: DrillDown
};

export type Props = InjectOptionsProps & ConnectedFunctions & {
	widget: SummaryWidget
};
