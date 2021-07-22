import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import {DEFAULT_PROPS} from './constants';
import FormControl from './FormControl';
import React from 'react';

export default {
	component: FormControl,
	title: 'Molecules/FormControl'
};

const Template = args => {
	const {children, ...otherArgs} = args;
	return (
		<div style={{backgroundColor: '#f5f6f6', width: 300}}>
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

export const WithButton = Template.bind({});

WithButton.args = {
	...DEFAULT_PROPS,
	children: (<Button>...</Button>),
	label: 'Label',
	reverse: true
};
