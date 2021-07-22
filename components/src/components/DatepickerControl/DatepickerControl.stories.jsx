import {action} from '@storybook/addon-actions';
import DatepickerControl from './DatepickerControl';
import React from 'react';

export default {
	component: DatepickerControl,
	title: 'Atoms/DatepickerControl'
};

const Template = args => {
	const onNextClick = () => {
		action('onNextClick')();
	};

	const onPrevClick = () => {
		action('onPrevClick')();
	};

	const props = {...args, onNextClick, onPrevClick};

	return <div style={{width: 300}}><DatepickerControl {...props} /></div>;
};

export const Default = Template.bind({});

Default.args = {
	transparent: false,
	value: new Date().toLocaleString('ru',
		{
			day: 'numeric',
			month: 'numeric',
			year: 'numeric'
		})
};
