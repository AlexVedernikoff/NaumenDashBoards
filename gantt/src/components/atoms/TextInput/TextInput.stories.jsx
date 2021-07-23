import {action} from '@storybook/addon-actions';
import React from 'react';
import TextInput from './TextInput';
import {useArgs} from '@storybook/client-api';

export default {
	component: TextInput,
	title: 'Atoms/TextInput'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();

	const onBlur = (event) => {
		action('onBlur')(event);
	};

	const onChange = ({name, value}) => {
		action('onChange')({name, value});
		updateArgs({ value });
	};

	const onFocus = (event) => {
		action('onFocus')(event);
	};

	return (
		<div style={{widht: 300}}>
			<TextInput
				{...args}
				onBlur={onBlur}
				onChange={onChange}
				onFocus={onFocus}
				value={value}
			/>
		</div>
	);
};

export const Default = Template.bind({});

Default.args = {
	disabled: false,
	maxLength: 20,
	name: 'name',
	onlyNumber: false,
	placeholder: 'placeholder',
	value: 'value'
};
