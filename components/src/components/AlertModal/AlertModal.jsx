// @flow
import {DEFAULT_BUTTONS, FOOTER_POSITIONS} from 'components/Modal/constants';
import Modal from 'components/Modal';
import type {Props} from './types';
import React from 'react';

const AlertModal = (props: Props) => {
	AlertModal.defaultProps = {
		cancelText: '',
		className: '',
		defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
		footerPosition: FOOTER_POSITIONS.LEFT,
		notice: true,
		showCancelButton: false,
		submitText: 'Ok'
	};

	return (
		<Modal {...props}>
			{props.text}
		</Modal>
	);
};

export default AlertModal;
