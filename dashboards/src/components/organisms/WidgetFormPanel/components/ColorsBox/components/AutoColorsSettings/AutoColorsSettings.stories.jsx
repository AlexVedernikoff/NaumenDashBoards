import {action} from '@storybook/addon-actions';
import AutoColorsSettings from './AutoColorsSettings';
import {DEFAULT_COLORS_SETTINGS} from 'store/widgets/data/constants';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: AutoColorsSettings,
	title: 'Organisms/WidgetFormPanel/Components/ColorsBox/Components/AutoColorsSettings'
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
			<AutoColorsSettings {...args} onChange={onChange} value={value} />
		</div>
	);
};

export const Component = Template.bind({});

Component.args = {
	value: DEFAULT_COLORS_SETTINGS.auto
};
