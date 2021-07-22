import {action} from '@storybook/addon-actions';
import Checkbox from './Checkbox';
import React, {useState} from 'react';

export default {
	component: Checkbox,
	title: 'Atoms/Checkbox'
};

const Template = args => {
	const [on, setOn] = useState(args.checked);
	const onChange = ({name, value}) => {
		action('onChange')({name, value});
		setOn(!on);
	};

	const props = {...args, checked: on, onChange, value: on};

	return <div style={{width: 300}}><Checkbox {...props} /></div>;
};

export const Default = Template.bind({});

Default.args = {
	checked: true,
	name: 'Checkbox'
};
