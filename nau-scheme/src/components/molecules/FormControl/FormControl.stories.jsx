// @flow
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Checkbox';
import {DEFAULT_PROPS} from './constants';
import FormControl from './FormControl';
import RadioButton from 'components/atoms/RadioButton';
import React from 'react';
import Toggle from 'components/atoms/Toggle';

export default {
	component: FormControl,
	title: 'Molecules/FormControl'
};

const Template = args => {
	const {children, ...otherArgs} = args;
	return (
		<div style={{backgroundColor: '#fff', width: 300}}>
			<FormControl {...otherArgs}>
				{children}
			</FormControl>
		</div>
	);
};

export const WithCheckbox = Template.bind({});

WithCheckbox.args = {
	...DEFAULT_PROPS,
	children: <Checkbox />,
	label: 'Label'
};

export const WithRadioButton = Template.bind({});

WithRadioButton.args = {
	...DEFAULT_PROPS,
	children: <RadioButton />,
	label: 'Label'
};

export const WithButton = Template.bind({});

WithButton.args = {
	...DEFAULT_PROPS,
	children: (<Button>...</Button>),
	label: 'Label',
	reverse: true
};

export const WithToggle = Template.bind({});

WithToggle.args = {
	...DEFAULT_PROPS,
	children: (<Toggle checked={true} />),
	label: 'Label',
	reverse: true
};
