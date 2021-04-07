import {action} from '@storybook/addon-actions';
import CustomLabelColorsSettings from './CustomLabelColorsSettings';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: CustomLabelColorsSettings,
	title: 'Organisms/WidgetFormPanel/Components/ColorsBox/Components/CustomLabelColorsSettings'
};

export const Component = args => {
	const [{value}, updateArgs] = useArgs();
	const onChange = (value) => {
		action('onChange')(value);
		updateArgs({value});
	};

	return <CustomLabelColorsSettings {...args} onChange={onChange} value={value} />;
};

Component.args = {
	labels: ['label1#test', 'label2', 'label3'],
	value: {
		colors: [],
		defaultColor: 'red'
	}
};
