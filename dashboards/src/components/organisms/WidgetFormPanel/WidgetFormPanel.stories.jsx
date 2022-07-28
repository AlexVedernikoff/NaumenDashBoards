import NewWidget from 'store/widgets/data/NewWidget';
import React from 'react';
import WidgetFormPanel from './WidgetFormPanel';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export default {
	component: WidgetFormPanel,
	title: 'Organisms/WidgetFormPanel'
};

const Template = args => <div style={{width: 300}}>{<WidgetFormPanel {...args} />}</div>;

export const AxisChartForm = Template.bind({});

AxisChartForm.args = {
	cancelForm: () => null,
	createToast: () => null,
	resetForm: () => null,
	widget: new NewWidget(undefined, WIDGET_TYPES.BAR)
};

export const CircleChartForm = Template.bind({});

CircleChartForm.args = {
	...AxisChartForm.args,
	widget: new NewWidget(undefined, WIDGET_TYPES.PIE)
};

export const ComboChartForm = Template.bind({});

ComboChartForm.args = {
	...AxisChartForm.args,
	widget: new NewWidget(undefined, WIDGET_TYPES.COMBO)
};

export const TableForm = Template.bind({});

TableForm.args = {
	...AxisChartForm.args,
	widget: new NewWidget(undefined, WIDGET_TYPES.TABLE)
};

export const TextForm = Template.bind({});

TextForm.args = {
	...AxisChartForm.args,
	widget: new NewWidget(undefined, WIDGET_TYPES.TEXT)
};

export const SpeedometerForm = Template.bind({});

SpeedometerForm.args = {
	...AxisChartForm.args,
	widget: new NewWidget(undefined, WIDGET_TYPES.SPEEDOMETER)
};

export const PivotForm = Template.bind({});

PivotForm.args = {
	...AxisChartForm.args,
	widget: new NewWidget(undefined, WIDGET_TYPES.PIVOT)
};
