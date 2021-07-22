import {action} from '@storybook/addon-actions';
import AlertModal from './AlertModal';
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from 'components/Modal/constants';
import React from 'react';

export default {
	argTypes: {
		size: {
			control: {
				options: Object.keys(SIZES),
				type: 'select'
			}
		}
	},
	component: AlertModal,
	title: 'Molecules/AlertModal'
};

const Template = args => {
	const onSubmit = () => {
		action('onSubmit')();
	};

	const props = {...args, onSubmit};

	return <div style={{width: 300}}><AlertModal {...props} /></div>;
};

export const Default = Template.bind({});

Default.args = {
	defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
	footerPosition: FOOTER_POSITIONS.LEFT,
	header: 'AlertModal',
	notice: true,
	showCancelButton: false,
	submitText: 'Ok',
	text: 'Контент'
};
