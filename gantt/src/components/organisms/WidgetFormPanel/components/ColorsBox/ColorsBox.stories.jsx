import {action} from '@storybook/addon-actions';
import {CHART_COLORS_SETTINGS_TYPES, DEFAULT_COLORS_SETTINGS} from 'store/widgets/data/constants';
import ColorsBox from './ColorsBox';
import {DEFAULT_COLORS} from 'utils/chart/constants';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: ColorsBox,
	title: 'Organisms/WidgetFormPanel/Components/ColorsBox'
};

const Template = (args) => {
	const [{value}, updateArgs] = useArgs();
	const onChange = (name, newValue) => {
		action('onChange')(name, newValue);
		updateArgs({
			value: newValue
		});
	};

	return (
		<div style={{width: 300}}>
			<ColorsBox {...args} onChange={onChange} value={value} />
		</div>
	);
};

export const AutoSettings = Template.bind({});

AutoSettings.args = {
	disabledCustomSettings: true,
	name: 'test',
	value: DEFAULT_COLORS_SETTINGS
};

export const CustomLabelSettings = Template.bind({});

CustomLabelSettings.args = {
	buildData: {
		data: {
			labels: ['label1', 'label2', 'label3'],
			series: [{}]
		}
	},
	disabledCustomSettings: false,
	name: 'test',
	value: {
		...DEFAULT_COLORS_SETTINGS,
		custom: {
			...DEFAULT_COLORS_SETTINGS.custom,
			data: {
				colors: [],
				defaultColor: DEFAULT_COLORS[0]
			}
		},
		type: CHART_COLORS_SETTINGS_TYPES.CUSTOM
	}
};

export const CustomBreakdownSettings = Template.bind({});

CustomBreakdownSettings.args = {
	buildData: {
		data: {
			labels: ['label1', 'label2', 'label3'],
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
		}
	},
	disabledCustomSettings: false,
	name: 'test',
	value: {
		...DEFAULT_COLORS_SETTINGS,
		custom: {
			...DEFAULT_COLORS_SETTINGS.custom,
			data: {
				colors: []
			}
		},
		type: CHART_COLORS_SETTINGS_TYPES.CUSTOM
	}
};
