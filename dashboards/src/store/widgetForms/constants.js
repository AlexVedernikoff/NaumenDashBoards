// @flow
import {DEFAULT_AGGREGATION, DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import type {Indicator, Parameter, SourceData} from './types';
import uuid from 'tiny-uuid';

const RESET_FORM: 'widgetForms/resetForm' = 'widgetForms/resetForm';
const SET_USER_MODE: 'widgetForms/setUserMode' = 'widgetForms/setUserMode';

const EVENTS = {
	CHANGE_AXIS_CHART_FORM_VALUES: 'widgetForms/changeAxisChartFormValues',
	CHANGE_CIRCLE_CHART_FORM_VALUES: 'widgetForms/changeCircleChartFormValues',
	CHANGE_COMBO_CHART_FORM_VALUES: 'widgetForms/changeComboChartFormValues',
	CHANGE_PIVOT_FORM_VALUES: 'widgetForms/changePivotFormValues',
	CHANGE_SPEEDOMETER_FORM_VALUES: 'widgetForms/changeSpeedometerFormValues',
	CHANGE_SUMMARY_FORM_VALUES: 'widgetForms/changeSummaryFormValues',
	CHANGE_TABLE_FORM_VALUES: 'widgetForms/changeTableFormValues',
	CHANGE_TEXT_FORM_VALUES: 'widgetForms/changeTextFormValues',
	RESET_FORM,
	SET_USER_MODE
};

const DEFAULT_INDICATOR: Indicator = {
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
};

const DEFAULT_PARAMETER: Parameter = {
	attribute: null,
	format: null,
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

const SHOW_SUB_TOTAL_MODE = {
	DISABLE: 'DISABLE',
	HIDE: 'HIDE',
	SHOW: 'SHOW'
};

export {
	DEFAULT_DATA_KEY,
	DEFAULT_INDICATOR,
	DEFAULT_PARAMETER,
	DEFAULT_SOURCE,
	EVENTS,
	SHOW_SUB_TOTAL_MODE
};
