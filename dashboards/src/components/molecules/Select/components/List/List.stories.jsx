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
	const [{multiple, options, value, values}, updateArgs] = useArgs();
	const onSelect = (event) => {
		const {value} = event;

		action('onSelect')(event);

		if (multiple) {
			if (values.includes(value)) {
				updateArgs({values: values.filter(item => item !== value)});
			} else {
				updateArgs({values: [value, ...values]});
			}
		} else {
			updateArgs({value});
		}
	};

	const onClickShowMore = () => {
		action('onClickShowMore')();
		updateArgs({options: [...options, ...options]});
	};

	return (
		<div style={{width: 300}}>
			<List {...args} onClickShowMore={onClickShowMore} onSelect={onSelect} options={options} value={value} values={values} />
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

export const ShowMore = Template.bind({});

ShowMore.args = {
	multiple: true,
	options: [...new Array(5)].map((_, idx) => ({ label: `element${idx}`, value: `value${idx}` })),
	showMore: true,
	values: []
};
