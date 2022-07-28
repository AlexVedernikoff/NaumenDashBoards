// @flow
import axisChartForm from './axisChartForm/reducer';
import circleChartForm from './circleChartForm/reducer';
import {combineReducers} from 'redux';
import comboChartForm from './comboChartForm/reducer';
import pivotForm from './pivotForm/reducer';
import speedometerForm from './speedometerForm/reducer';
import summaryForm from './summaryForm/reducer';
import tableForm from './tableForm/reducer';
import textForm from './textForm/reducer';

const widgetFormsReducer = combineReducers({
	axisChartForm,
	circleChartForm,
	comboChartForm,
	pivotForm,
	speedometerForm,
	summaryForm,
	tableForm,
	textForm
});

export default widgetFormsReducer;
