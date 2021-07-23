// @flow
import type {DrillDown} from 'store/widgets/links/types';
import type {SummaryWidget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: DrillDown
};

export type Props = ConnectedFunctions & {
	widget: SummaryWidget
};
