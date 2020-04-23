// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {SummaryIndicator, SummaryWidget} from 'store/widgets/data/types';

export type Props = {
	data: DiagramBuildData,
	widget: SummaryWidget
};

export type State = {
	height: number,
	title: string,
	total: number
};

export type DefaultSummarySettings = {
	indicator: SummaryIndicator
};
