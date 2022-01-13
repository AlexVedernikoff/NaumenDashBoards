// @flow
import {COMMON_DIALOG_EVENTS, DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from './constants';
import type {LangType} from 'localization/localize_types';

type Size = $Keys<typeof SIZES>;

type FooterPosition = $Keys<typeof FOOTER_POSITIONS>;
type DefaultButton = $Keys<typeof DEFAULT_BUTTONS>;
export type CommonDialogsOptionsOptional = {|
	cancelText: LangType,
	className: string,
	defaultButton: DefaultButton,
	footerPosition: FooterPosition,
	notice: boolean,
	showCancelButton: boolean,
	size: Size | number,
	submitText: LangType,
|};

export type ConfirmDialogOptions = {|
	cancelText: LangType,
	className: string,
	defaultButton: DefaultButton,
	footerPosition: FooterPosition,
	size: Size | number,
	submitText: LangType,
|};

export type AlertDialogOptions = {|
	className: string,
	footerPosition: FooterPosition,
	size: Size | number,
	submitText: LangType,
|};

export type CommonDialogsOptionsRequired = {|
	header: string,
	text: string,
|};

export type CommonDialogsOpions = {...CommonDialogsOptionsRequired, ...CommonDialogsOptionsOptional};

export type CommonDialogResolver = (resolveState: Promise<boolean> | boolean) => void;

export type CommonDialog = {
	options: CommonDialogsOpions,
	resolve: CommonDialogResolver,
};

export type CommonDialogsState = {
	AlertModal: ?CommonDialog,
	ConfirmModal: ?CommonDialog,
};

type CloseConfirmDialogAction = {
	type: typeof COMMON_DIALOG_EVENTS.CLOSE_CONFIRM_DIALOG;
};

type CloseAlertAction = {
	type: typeof COMMON_DIALOG_EVENTS.CLOSE_CONFIRM_DIALOG;
};

type ShowConfirmDialogAction = {
	payload: CommonDialog,
	type: typeof COMMON_DIALOG_EVENTS.SHOW_CONFIRM_DIALOG;
};

type ShowAlertAction = {
	payload: CommonDialog,
	type: typeof COMMON_DIALOG_EVENTS.SHOW_ALERT;
};

type UnknownCommonDialogAction = {
	type: typeof COMMON_DIALOG_EVENTS.UNKNOWN_COMMON_DIALOG_ACTION
};

export type CommonDialogActions =
	| CloseConfirmDialogAction
	| CloseAlertAction
	| ShowConfirmDialogAction
	| ShowAlertAction
	| UnknownCommonDialogAction
;
