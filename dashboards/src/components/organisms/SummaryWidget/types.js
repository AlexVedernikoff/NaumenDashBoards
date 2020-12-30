// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDown} from 'store/widgets/links/types';
import type {SummaryIndicator, SummaryWidget} from 'store/widgets/data/types';

export type Props = {
	data: DiagramBuildData,
	onDrillDown: DrillDown,
	widget: SummaryWidget
};

export type DefaultSummarySettings = {
	indicator: SummaryIndicator
};
