import {action} from '@storybook/addon-actions';
import ConfirmModal from './ConfirmModal';
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
	component: ConfirmModal,
	title: 'Molecules/ConfirmModal'
};

const Template = args => {
	const onClose = () => {
		action('onClose')();
	};

	const onSubmit = () => {
		action('onSubmit')();
	};

	const props = {...args, onClose, onSubmit};

	return <div style={{width: 300}}><ConfirmModal {...props} /></div>;
};

export const Default = Template.bind({});

Default.args = {
	cancelText: 'Отмена',
	className: '',
	defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
	footerPosition: FOOTER_POSITIONS.LEFT,
	header: 'ConfirmModal',
	notice: true,
	showCancelButton: true,
	submitText: 'Подтвердить',
	text: 'Контент'
};
