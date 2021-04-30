// @flow
import type {CommonDialogsOptionsOptional} from './types';
import {
	DEFAULT_BUTTONS as COMPONENT_DEFAULT_BUTTONS,
	FOOTER_POSITIONS as COMPONENT_FOOTER_POSITIONS,
	SIZES as COMPONENT_SIZES
} from 'components/molecules/Modal/constants';

const DEFAULT_BUTTONS = COMPONENT_DEFAULT_BUTTONS;

const FOOTER_POSITIONS = COMPONENT_FOOTER_POSITIONS;

const SIZES = COMPONENT_SIZES;

const SHOW_ALERT: 'SHOW_ALERT' = 'SHOW_ALERT';
const SHOW_CONFIRM_DIALOG: 'SHOW_CONFIRM_DIALOG' = 'SHOW_CONFIRM_DIALOG';
const UNKNOWN_COMMON_DIALOG_ACTION: 'UNKNOWN_MODALS_ACTION' = 'UNKNOWN_MODALS_ACTION';
const CLOSE_ALERT: 'CLOSE_ALERT' = 'CLOSE_ALERT';
const CLOSE_CONFIRM_DIALOG: 'CLOSE_CONFIRM_DIALOG' = 'CLOSE_CONFIRM_DIALOG';

const COMMON_DIALOG_EVENTS = {
	CLOSE_ALERT,
	CLOSE_CONFIRM_DIALOG,
	SHOW_ALERT,
	SHOW_CONFIRM_DIALOG,
	UNKNOWN_COMMON_DIALOG_ACTION
};

const DEFAULT_CONFIRM_DIALOG_OPTION: CommonDialogsOptionsOptional = {
	cancelText: 'Отмена',
	className: '',
	defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
	footerPosition: FOOTER_POSITIONS.LEFT,
	notice: true,
	showCancelButton: true,
	size: SIZES.NORMAL,
	submitText: 'Подтвердить'
};

const DEFAULT_ALERT_OPTION: CommonDialogsOptionsOptional = {
	cancelText: '',
	className: '',
	defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
	footerPosition: FOOTER_POSITIONS.LEFT,
	notice: true,
	showCancelButton: false,
	size: SIZES.NORMAL,
	submitText: 'Ok'
};

export {
	DEFAULT_ALERT_OPTION,
	DEFAULT_BUTTONS,
	DEFAULT_CONFIRM_DIALOG_OPTION,
	FOOTER_POSITIONS,
	SIZES,
	COMMON_DIALOG_EVENTS
};
