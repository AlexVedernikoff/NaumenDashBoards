import {action} from '@storybook/addon-actions';
import CustomBreakdownColorsSettings from './CustomBreakdownColorsSettings';
import {CUSTOM_CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: CustomBreakdownColorsSettings,
	title: 'Organisms/DiagramWidgetEditForm/Components/ColorsBox/Components/CustomBreakdownColorsSettings'
};

export const Component = args => {
	const [{value}, updateArgs] = useArgs();
	const onChange = (value) => {
		action('onChange')(value);
		updateArgs({value});
	};

	return <CustomBreakdownColorsSettings {...args} onChange={onChange} value={value} />;
};

Component.args = {
	value: {
		colors: [
			{
			color: 'blue',
			text: 'breakdown1'
			},
			{
				color: 'red',
				text: 'breakdown2'
			},
			{
				color: 'green',
				text: 'breakdown3'
			}
		],
		type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
	}
};
