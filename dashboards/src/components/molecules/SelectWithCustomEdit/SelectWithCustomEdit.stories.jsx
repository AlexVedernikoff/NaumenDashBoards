import {action} from '@storybook/addon-actions';
import React from 'react';
import SelectWithCustomEdit from './SelectWithCustomEdit';
import {useArgs} from '@storybook/client-api';

export default {
	argTypes: { },
	component: SelectWithCustomEdit,
	title: 'Molecules/SelectWithCustomEdit'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = (event) => {
		const {value: newValue} = event;

		action('onSelect')(event);
		updateArgs({
			value: newValue
		});
	};

	return (
		<div style={{width: 300}}>
			<SelectWithCustomEdit {...args} onSelect={onSelect} value={value} />
		</div>
	);
};

export const Simple = Template.bind({});

Simple.args = {
	options: [' руб.', '%', ' биткоин']
};
