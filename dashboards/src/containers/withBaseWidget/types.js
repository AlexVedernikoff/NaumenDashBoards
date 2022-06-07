// @flow
import type {Chart, SetWidgetWarning} from 'store/widgets/data/types';
import type {DiagramBuildData, DiagramData, FetchBuildData} from 'store/widgets/buildData/types';
import type {DivRef} from 'components/types';
import type {DrillDown} from 'store/widgets/links/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

type CommonOptions = Object;

export type ConnectedFunctions = {
	drillDown: DrillDown,
	fetchBuildData: FetchBuildData,
	setWidgetWarning: (info: SetWidgetWarning) => void,
};

export type ConnectedProps = {
	buildData: DiagramData,
	globalColorsSettings: GlobalCustomChartColorsSettings
};

export type WidgetProps = {
	widget: Chart
};

export type ComponentProps = ConnectedProps & ConnectedFunctions & {
	forwardedRef: DivRef,
};

export type InjectLoadingProps = {
	data: DiagramBuildData
};

export type InjectOptionsProps = {
	data: DiagramBuildData,
	drillDown: DrillDown,
	hiddenSeries: Array<string>,
	options: CommonOptions,
	setWidgetWarning: (info: SetWidgetWarning) => void,
	toggleSeriesShow: (series: string) => void,
	updateOptions: (container: HTMLDivElement) => void
};

export type ComponentState = {
	container: HTMLDivElement | null,
	hiddenSeries: Array<string>,
	options: CommonOptions | null
};
