import {action} from '@storybook/addon-actions';
import Datepicker from './Datepicker';
import React from 'react';

export default {
	component: Datepicker,
	title: 'Molecules/Datepicker'
};

const Template = args => {
	const onSelect = (value) => {
		action(value)(event);
	};

	return (
		<div style={{width: 300}}>
			<Datepicker {...args} onSelect={(value) => onSelect(value)} />
		</div>
	);
};

export const Default = Template.bind({});
