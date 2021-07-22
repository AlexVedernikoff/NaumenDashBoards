import {action} from '@storybook/addon-actions';
import Button from './Button';
import React from 'react';
import {VARIANTS} from './constants';

export default {
	argTypes: {
		variant: {
			control: {
				options: Object.keys(VARIANTS),
				type: 'select'
			}
		}
	},
	component: Button,
	title: 'Atoms/Button'
};

const Template = args => {
	const onClick = () => {
		action('onClick')();
	};

	const props = {...args, onClick};

	return <div style={{width: 300}}><Button {...props}>{args.children}</Button></div>;
};

export const Default = Template.bind({});

Default.args = {
	block: false,
	children: 'Отмена',
	disabled: false,
	outline: false,
	type: 'button',
	variant: VARIANTS.GREEN
};
