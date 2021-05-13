// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import {deepClone} from 'helpers';
import type {Dispatch} from 'store/types';
import {EVENTS} from './constants';
import type {Values as AxisValues} from './axisChartForm/types';
import type {Values as CircleValues} from './circleChartForm/types';
import type {Values as ComboValues} from './comboChartForm/types';
import type {Values as SpeedometerValues} from './speedometerForm/types';
import type {Values as SummaryValues} from './summaryForm/types';
import type {Values as TableValues} from './tableForm/types';
import type {Values as TextValues} from './textForm/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const setWidgetValues = (widget: AnyWidget) => (dispatch: Dispatch) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SPEEDOMETER, SUMMARY, TABLE, TEXT} = WIDGET_TYPES;
	const {id, type, ...rest} = widget;
	const values = deepClone(rest);

	switch (widget.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return dispatch(changeAxisChartFormValues(values));
		case DONUT:
		case PIE:
			return dispatch(changeCircleChartFormValues(values));
		case COMBO:
			return dispatch(changeComboChartFormValues(values));
		case SPEEDOMETER:
			return dispatch(changeSpeedometerFormValues(values));
		case SUMMARY:
			return dispatch(changeSummaryFormValues(values));
		case TABLE:
			return dispatch(changeTableFormValues(values));
		case TEXT:
			return dispatch(changeTextFormValues(values));
		default:
			return null;
	}
};

const changeAxisChartFormValues = (payload: AxisValues) => ({
	payload,
	type: EVENTS.CHANGE_AXIS_CHART_FORM_VALUES
});

const changeCircleChartFormValues = (payload: CircleValues) => ({
	payload,
	type: EVENTS.CHANGE_CIRCLE_CHART_FORM_VALUES
});

const changeComboChartFormValues = (payload: ComboValues) => ({
	payload,
	type: EVENTS.CHANGE_COMBO_CHART_FORM_VALUES
});

const changeSpeedometerFormValues = (payload: SpeedometerValues) => ({
	payload,
	type: EVENTS.CHANGE_SPEEDOMETER_FORM_VALUES
});

const changeSummaryFormValues = (payload: SummaryValues) => ({
	payload,
	type: EVENTS.CHANGE_SUMMARY_FORM_VALUES
});

const changeTableFormValues = (payload: TableValues) => ({
	payload,
	type: EVENTS.CHANGE_TABLE_FORM_VALUES
});

const changeTextFormValues = (payload: TextValues) => ({
	payload,
	type: EVENTS.CHANGE_TEXT_FORM_VALUES
});

const resetForm = () => ({
	type: EVENTS.RESET_FORM
});

export {
	changeAxisChartFormValues,
	changeCircleChartFormValues,
	changeComboChartFormValues,
	changeSpeedometerFormValues,
	changeSummaryFormValues,
	changeTableFormValues,
	changeTextFormValues,
	resetForm,
	setWidgetValues
};
