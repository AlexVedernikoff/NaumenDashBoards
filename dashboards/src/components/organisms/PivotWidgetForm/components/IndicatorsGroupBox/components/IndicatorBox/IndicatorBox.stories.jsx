// @flow
import {action} from '@storybook/addon-actions';
import IndicatorBox from './IndicatorBox';
import React from 'react';

export default {
	component: IndicatorBox,
	title: 'Organisms/IndicatorGroupBox/IndicatorBox'
};

const defaultProps = {
	checked: false,
	hasBreakdown: false,
	label: '123'
};

const Template = args => <IndicatorBox {...args} onClose={action('onClose')} />;

export const Default = Template.bind({}, {...defaultProps, label: 'Default'});

export const CustomLabel = Template.bind({});

CustomLabel.args = {
	...defaultProps,
	label: 'Custom label'
};

export const LongLabel = Template.bind({}, {
	...defaultProps,
	label: 'Long label Long label Long label Long label Long label Long label'
});

export const Checked = Template.bind({});

Checked.args = {
	...defaultProps,
	checked: true,
	label: 'Checked'
};

export const HasBreakdown = Template.bind({});

HasBreakdown.args = {
	...defaultProps,
	hasBreakdown: true,
	label: 'HasBreakdown'
};
