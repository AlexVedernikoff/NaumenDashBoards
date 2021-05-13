// @flow
import {action} from '@storybook/addon-actions';
import List from './List';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: List,
	title: 'Molecules/Select/List'
};

const Template = args => {
	const [{multiple, value, values}, updateArgs] = useArgs();
	const onSelect = (event) => {
		action('onSelect')(event);

		if (multiple) {
			updateArgs({
				values: event
			});
		} else {
			updateArgs({
				value: event.value
			});
		}
	};

	return (
		<div style={{width: 300}}>
			<List {...args} onSelect={onSelect} value={value} values={values} />
		</div>
	);
};

export const Simple = Template.bind({});

Simple.args = {
	multiple: false,
	options: [
		{
			label: 'element1',
			value: 'value1'
		},
		{
			label: 'element2',
			value: 'value2'
		}
	],
	value: null
};

export const Multiple = Template.bind({});

Multiple.args = {
	multiple: true,
	options: [...new Array(10)].map((_, idx) => ({ label: `element${idx}`, value: `value${idx}` })),
	values: []
};
