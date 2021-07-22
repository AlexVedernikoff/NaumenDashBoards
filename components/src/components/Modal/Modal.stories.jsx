import {action} from '@storybook/addon-actions';
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from './constants';
import Modal from './Modal';
import React from 'react';

export default {
	argTypes: {
		footerPosition: {
			control: {
				options: Object.keys(FOOTER_POSITIONS),
				type: 'select'
			}
		},
		size: {
			control: {
				options: Object.keys(SIZES),
				type: 'select'
			}
		}
	},
	component: Modal,
	title: 'Molecules/Modal'
};

const Template = args => {
	const onClose = () => {
		action('onClose')();
	};

	const onSubmit = () => {
		action('onSubmit')();
	};

	const props = {...args, onClose, onSubmit};

	return <div style={{width: 300}}><Modal {...props}>{args.children}</Modal></div>;
};

export const Default = Template.bind({});

Default.args = {
	cancelText: 'Отмена',
	children: <div style={{height: 100, padding: '1rem'}}>Контент</div>,
	defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
	footerPosition: FOOTER_POSITIONS.LEFT,
	header: 'Заголовок',
	notice: false,
	showCancelButton: true,
	size: SIZES.NORMAL,
	submitText: 'Сохранить',
	submitting: false
};
