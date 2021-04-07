// @flow
import {DEFAULT_AGGREGATION, DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import type {Indicator, Parameter, SourceData} from './types';
import uuid from 'tiny-uuid';

const CHANGE_AXIS_CHART_FORM_VALUES: 'widgetForms/changeAxisChartFormValues' = 'widgetForms/changeAxisChartFormValues';
const CHANGE_CIRCLE_CHART_FORM_VALUES: 'widgetForms/changeCircleChartFormValues' = 'widgetForms/changeCircleChartFormValues';
const CHANGE_COMBO_CHART_FORM_VALUES: 'widgetForms/changeComboChartFormValues' = 'widgetForms/changeComboChartFormValues';
const CHANGE_SPEEDOMETER_FORM_VALUES: 'widgetForms/changeSpeedometerFormValues' = 'widgetForms/changeSpeedometerFormValues';
const CHANGE_SUMMARY_FORM_VALUES: 'widgetForms/changeSummaryFormValues' = 'widgetForms/changeSummaryFormValues';
const CHANGE_TABLE_FORM_VALUES: 'widgetForms/changeTableFormValues' = 'widgetForms/changeTableFormValues';
const CHANGE_TEXT_FORM_VALUES: 'widgetForms/changeTextFormValues' = 'widgetForms/changeTextFormValues';
const RESET_FORM: 'widgetForms/resetForm' = 'widgetForms/resetForm';

const EVENTS = {
	CHANGE_AXIS_CHART_FORM_VALUES,
	CHANGE_CIRCLE_CHART_FORM_VALUES,
	CHANGE_COMBO_CHART_FORM_VALUES,
	CHANGE_SPEEDOMETER_FORM_VALUES,
	CHANGE_SUMMARY_FORM_VALUES,
	CHANGE_TABLE_FORM_VALUES,
	CHANGE_TEXT_FORM_VALUES,
	RESET_FORM
};

const DEFAULT_INDICATOR: Indicator = {
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
};

const DEFAULT_PARAMETER: Parameter = {
	attribute: null,
	group: {
		data: DEFAULT_SYSTEM_GROUP.OVERLAP,
		way: GROUP_WAYS.SYSTEM
	}
};

const DEFAULT_SOURCE: SourceData = {
	descriptor: '',
	filterId: null,
	value: null
};

const DEFAULT_DATA_KEY = uuid();

export {
	DEFAULT_DATA_KEY,
	DEFAULT_INDICATOR,
	DEFAULT_PARAMETER,
	DEFAULT_SOURCE,
	EVENTS
};
