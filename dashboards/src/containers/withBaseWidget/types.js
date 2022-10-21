// @flow
import type {Chart, SetWidgetWarning} from 'store/widgets/data/types';
import type {DiagramBuildData, DiagramData, FetchBuildDataAction} from 'store/widgets/buildData/types';
import type {DivRef} from 'components/types';
import type {DrillDownAction} from 'store/widgets/links/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

type CommonOptions = Object;

export type ConnectedFunctions = {
	drillDown: DrillDownAction,
	fetchBuildData: FetchBuildDataAction,
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
	drillDown: DrillDownAction,
	hiddenSeries: Array<string>,
	options: CommonOptions,
	setWidgetWarning: (info: SetWidgetWarning) => void,
	toggleSeriesShow: (series: string) => void,
	updateOptions: (container: HTMLDivElement) => void
};

export type ComponentState = {
	height: number,
	hiddenSeries: Array<string>,
	options: CommonOptions | null,
	updateError: boolean,
	width: number
};
