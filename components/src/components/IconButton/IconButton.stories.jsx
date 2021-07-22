import {action} from '@storybook/addon-actions';
import IconButton from './IconButton';
import {ICON_NAMES} from 'components/Icon';
import React from 'react';
import {VARIANTS} from './constants';

export default {
	argTypes: {
		icon: {
			control: {
				options: Object.keys(ICON_NAMES),
				type: 'select'
			}
		},
		variant: {
			control: {
				options: Object.keys(VARIANTS),
				type: 'select'
			}
		}
	},
	component: IconButton,
	title: 'Atoms/IconButton'
};

const Template = args => {
	const onClick = () => {
		action('onClick')();
	};

	const props = {...args, onClick};

	return <div style={{width: 300}}><IconButton {...props} /></div>;
};

export const Default = Template.bind({});

Default.args = {
	active: true,
	icon: ICON_NAMES.SAVE,
	variant: VARIANTS.INFO
};
