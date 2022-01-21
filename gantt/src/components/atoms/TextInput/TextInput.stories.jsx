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

	const props = {...args, onBlur, onChange, onFocus, value};

	return <div style={{width: 300}}><TextInput {...props} /></div>;
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
