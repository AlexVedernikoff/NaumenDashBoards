// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomFilter, Group, MixedAttribute, Source, WidgetTooltip} from 'store/widgets/data/types';
import type {DataSet as AxisChartDataSet, State as AxisChartFormState, Values as AxisChartValues} from './axisChartForm/types';
import type {DataSet as CircleChartDataSet, State as CircleChartFormState, Values as CircleChartValues} from './circleChartForm/types';
import type {DataSet as ComboChartDataSet, State as ComboChartFormState, Values as ComboChartValues} from './comboChartForm/types';
import type {DataSet as SummaryDataSet, State as SummaryFormState, Values as SummaryValues} from './summaryForm/types';
import type {DataSet as TableDataSet, State as TableFormState, Values as TableValues} from './tableForm/types';
import type {DataSet as PivotDataSet, State as PivotFormState, Values as PivotValues} from './pivotForm/types';
import {EVENTS} from 'store/widgetForms/constants';
import type {State as SpeedometerFormState, Values as SpeedometerValues} from './speedometerForm/types';
import type {State as TextFormState, Values as TextValues} from './textForm/types';

export type SourceData = {
	descriptor: string,
	filterId: string | null,
	value: Source | null,
	widgetFilterOptions?: Array<CustomFilter>
};

export type BreakdownItem = {
	attribute: Attribute | null,
	dataKey: string,
	group: Group
};

export type Indicator = {
	aggregation: string,
	attribute: MixedAttribute | null,
	descriptor?: string | null,
	tooltip?: WidgetTooltip
};

export type Parameter = {
	attribute: Attribute | null,
	group: Group
};

export type ParameterOrder = {
	dataKey: string,
	parameter: Parameter
};

export type Breakdown = Array<BreakdownItem>;

export type ChangeAxisChartFormValuesAction = {
	payload: AxisChartValues,
	type: typeof EVENTS.CHANGE_AXIS_CHART_FORM_VALUES
};

export type ChangeCircleChartFormValuesAction = {
	payload: CircleChartValues,
	type: typeof EVENTS.CHANGE_CIRCLE_CHART_FORM_VALUES
};

export type ChangeComboChartFormValuesAction = {
	payload: ComboChartValues,
	type: typeof EVENTS.CHANGE_COMBO_CHART_FORM_VALUES
};

export type ChangeSpeedometerChartFormValuesAction = {
	payload: SpeedometerValues,
	type: typeof EVENTS.CHANGE_SPEEDOMETER_FORM_VALUES
};

export type ChangeSummaryChartFormValuesAction = {
	payload: SummaryValues,
	type: typeof EVENTS.CHANGE_SUMMARY_FORM_VALUES
};

export type ChangeTableFormValuesAction = {
	payload: TableValues,
	type: typeof EVENTS.CHANGE_TABLE_FORM_VALUES
};

export type ChangePivotFormValuesAction = {
	payload: PivotValues,
	type: typeof EVENTS.CHANGE_PIVOT_FORM_VALUES
};

export type ChangeTextFormValuesAction = {
	payload: TextValues,
	type: typeof EVENTS.CHANGE_TEXT_FORM_VALUES
};

export type ResetFormAction = {
	payload: AxisChartValues,
	type: typeof EVENTS.RESET_FORM
};

export type Action =
	| ChangeAxisChartFormValuesAction
	| ChangeCircleChartFormValuesAction
	| ChangeComboChartFormValuesAction
	| ChangePivotFormValuesAction
	| ChangeSpeedometerChartFormValuesAction
	| ChangeSummaryChartFormValuesAction
	| ChangeTableFormValuesAction
	| ChangeTextFormValuesAction
	| ResetFormAction;

export type DiagramDataSet =
	| AxisChartDataSet
	| CircleChartDataSet
	| ComboChartDataSet
	| SummaryDataSet
	| TableDataSet
	| PivotDataSet;

export type DiagramValues =
	| AxisChartValues
	| CircleChartValues
	| ComboChartValues
	| SpeedometerValues
	| SummaryValues
	| TableValues;

export type Values = DiagramValues | TextValues;

export type WidgetFormsState = {
	axisChartForm: AxisChartFormState,
	circleChartForm: CircleChartFormState,
	comboChartForm: ComboChartFormState,
	pivotForm: PivotFormState,
	speedometerForm: SpeedometerFormState,
	summaryForm: SummaryFormState,
	tableForm: TableFormState,
	textForm: TextFormState
};
