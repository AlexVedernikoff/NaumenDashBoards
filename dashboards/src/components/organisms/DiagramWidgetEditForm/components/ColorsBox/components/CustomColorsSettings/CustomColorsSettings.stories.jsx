import {action} from '@storybook/addon-actions';
import {CUSTOM_CHART_COLORS_SETTINGS_TYPES, DEFAULT_COLORS_SETTINGS} from 'src/store/widgets/data/constants';
import CustomColorsSettings from './CustomColorsSettings';
import {DEFAULT_CHART_COLORS} from 'store/widgets/data/constants';
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

export const LabelSettings = Template.bind({});

LabelSettings.args = {
	labels: ['label1', 'label2', 'label3'],
	value: {
		...DEFAULT_COLORS_SETTINGS.custom,
		data: {
			colors: [],
			defaultColor: DEFAULT_CHART_COLORS[0],
			type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.LABEL
		}
	}
};

export const BreakdownSettings = Template.bind({});

BreakdownSettings.args = {
	value: {
		...DEFAULT_COLORS_SETTINGS.custom,
		data: {
			colors: [
				{
					color: 'blue',
					text: 'breakdown1'
				},
				{
					color: 'green',
					text: 'breakdown2'
				}
			],
			type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
		}
	}
};
