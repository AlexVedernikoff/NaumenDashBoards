import {action} from '@storybook/addon-actions';
import {CUSTOM_CHART_COLORS_SETTINGS_TYPES, DEFAULT_CHART_COLORS, WIDGET_TYPES} from 'store/widgets/data/constants';
import CustomColorsSettings from './CustomColorsSettings';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: CustomColorsSettings,
	title: 'Organisms/DiagramWidgetEditForm/Components/ColorsBox/Components/CustomColorsSettings'
};

const Template = (args) => {
	const [{value}, updateArgs] = useArgs();
	const onChange = (newValue) => {
		action('onChange')(newValue);
		updateArgs({
			value: newValue
		});
	};

	return (
		<div style={{width: 300}}>
			<CustomColorsSettings {...args} onChange={onChange} value={value} />
		</div>
	);
};

export const AxisLabelSettings = Template.bind({});

AxisLabelSettings.args = {
	buildData: {
		data: {
			labels: ['label1', 'label2', 'label3'],
			series: [{}]
		},
		type: WIDGET_TYPES.BAR
	},
	defaultColors: DEFAULT_CHART_COLORS,
	value: {
		data: {
			colors: [],
			defaultColor: 'red',
			type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.LABEL
		}
	}
};

export const AxisBreakdownSettings = Template.bind({});

AxisBreakdownSettings.args = {
	buildData: {
		data: {
			series: [
				{
					name: 'breakdown1'
				},
				{
					name: 'breakdown2'
				},
				{
					name: 'breakdown3'
				}
			]
		},
		type: WIDGET_TYPES.BAR
	},
	defaultColors: DEFAULT_CHART_COLORS,
	value: {
		data: {
			colors: [],
			type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
		}
	}
};

export const CircleBreakdownSettings = Template.bind({});

CircleBreakdownSettings.args = {
	...AxisBreakdownSettings.args,
	buildData: {
		data: {
			labels: ['label1', 'label2', 'label3'],
			series: [1, 2, 3]
		},
		type: WIDGET_TYPES.PIE
	}
};
