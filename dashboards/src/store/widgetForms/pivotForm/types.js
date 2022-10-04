// @flow
import type {BreakdownItem, Indicator, Parameter, ParameterOrder, SourceData} from 'store/widgetForms/types';
import type {
	ComputedAttr,
	DisplayMode,
	Header,
	IndicatorGrouping,
	NavigationSettings,
	PivotData,
	PivotLink,
	PivotStyle,
	WidgetTooltip
} from 'store/widgets/data/types';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'src/store/widgetForms/circleChartForm/types';
import type {Values as ComboChartValues} from 'src/store/widgetForms/comboChartForm/types';
import type {Values as TableValues} from 'src/store/widgetForms/tableForm/types';
import type {Values as SummaryValues} from 'src/store/widgetForms/summaryForm/types';
import type {Values as SpeedometerValues} from 'src/store/widgetForms/speedometerForm/types';

export type PivotIndicator = {
	...Indicator,
	breakdown?: BreakdownItem,
	descriptor: ?string,
	key: string
};

export type DataSet = $Exact<{
	...PivotData,
	dataKey: string,
	indicators: Array<PivotIndicator>,
	parameters: Array<Parameter>,
	source: SourceData
}>;

export type Values = $Exact<{
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	displayMode: DisplayMode,
	header: Header,
	indicatorGrouping: IndicatorGrouping | null,
	links: Array<PivotLink>,
	name: string,
	navigation: NavigationSettings,
	parametersOrder: Array<ParameterOrder>,
	pivot: PivotStyle,
	showTotalAmount: boolean,
	showTotalRowAmount: boolean,
	templateName: string,
	tooltip: WidgetTooltip,
}>;

export type State = Values;

export type NotPivotValues =
	| AxisChartValues
	| CircleChartValues
	| ComboChartValues
	| TableValues
	| SummaryValues
	| SpeedometerValues;

export type NotPivotValuesDataSets = $PropertyType<NotPivotValues, 'data'>;

export type ParseDataForPivotResult = {
	data: Array<DataSet>,
	indicatorGrouping: IndicatorGrouping,
	parametersOrder: Array<ParameterOrder>
};
