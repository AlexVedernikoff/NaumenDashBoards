// @flow
import {action} from '@storybook/addon-actions';
import {DEFAULT_PROPS} from './constants';
import {NumberInput} from './NumberInput';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: NumberInput,
	title: 'Atoms/NumberInput'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();

	const onChange = event => {
		const {value: newValue} = event;

		action('onChange')(event);
		updateArgs({
			value: newValue
		});
	};

	return (
		<div style={{width: 300}}>
			<NumberInput {...args} onChange={onChange} value={value} />
		</div>
	);
};

export const Simple = Template.bind({});

Simple.args = {
	...DEFAULT_PROPS,
	placeholder: 'Укажите значение',
	value: 0
};
