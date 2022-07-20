import {action} from '@storybook/addon-actions';
import CustomBreakdownColorsSettings from './CustomBreakdownColorsSettings';
import {DEFAULT_CHART_COLORS} from 'store/widgets/data/constants';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: CustomBreakdownColorsSettings,
	title: 'Organisms/WidgetFormPanel/Components/ColorsBox/Components/CustomBreakdownColorsSettings'
};

export const Component = args => {
	const [{value}, updateArgs] = useArgs();

	const onChange = value => {
		action('onChange')(value);
		updateArgs({value});
	};

	return <CustomBreakdownColorsSettings {...args} onChange={onChange} value={value} />;
};

Component.args = {
	defaultColors: DEFAULT_CHART_COLORS,
	labels: ['label1#test', 'label2', 'label3'],
	value: {
		colors: [{
			color: 'blue',
			key: 'label1#test'
		}]
	}
};
