// @flow
import type {AlertDialogOptions, ConfirmDialogOptions} from './types';
import {COMMON_DIALOG_EVENTS, DEFAULT_ALERT_OPTION, DEFAULT_CONFIRM_DIALOG_OPTION} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';

/**
 * Открывает модальное диалоговое окно подтверждения
 * @param {string} header - заголовок окна
 * @param {string} text - текст внутри окна
 * @param {ConfirmDialogOptions?} options - дополнительные опции диалогового окна
 * @returns {ThunkAction<Promise<boolean>>} - обещание, которое будет разрешено при подверждении выбора пользователем
 */
const confirmDialog = (header: string, text: string, options?: $Shape<ConfirmDialogOptions>): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<boolean> => {
		const dialogOption = {header, text, ...DEFAULT_CONFIRM_DIALOG_OPTION, ...options};
		return new Promise<boolean>(resolve => {
			dispatch({
				payload: { options: dialogOption, resolve },
				type: COMMON_DIALOG_EVENTS.SHOW_CONFIRM_DIALOG
			});
		});
	};

/**
 * Открывает информационное диалоговое окно
 * @param {string} header - заголовок окна
 * @param {string} text - текст внутри окна
 * @param {AlertDialogOptions?} options - дополнительные опции диалогового окна
 * @returns {ThunkAction<Promise<boolean>>} - обещание, которое будет разрешено при закрытии окна
 */
const showAlert = (header: string, text: string, options?: $Shape<AlertDialogOptions>): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<boolean> => {
		const dialogOption = {header, text, ...DEFAULT_ALERT_OPTION, ...options};
		return new Promise<boolean>(resolve => {
			dispatch({
				payload: { options: dialogOption, resolve },
				type: COMMON_DIALOG_EVENTS.SHOW_ALERT
			});
		});
	};

/**
 * Закрывает модальное диалоговое окно подтверждения
 * @param {boolean} status - Результат выбора пользователя
 * @returns {ThunkAction}
 */
const closeConfirmDialog = (status: boolean): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState) => {
		const state = getState();
		const { commonDialogs: {ConfirmModal} } = state;

		if (ConfirmModal) {
			ConfirmModal.resolve(status);
			dispatch({
				type: COMMON_DIALOG_EVENTS.CLOSE_CONFIRM_DIALOG
			});
		}
	};

/**
 * Закрывает информационное диалоговое окно подтверждения
 * @returns {ThunkAction}
 */
const closeAlert = (): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState) => {
		const state = getState();
		const { commonDialogs: {AlertModal} } = state;

		if (AlertModal) {
			AlertModal.resolve(true);
			dispatch({
				type: COMMON_DIALOG_EVENTS.CLOSE_ALERT
			});
		}
	};

export {
	closeAlert,
	closeConfirmDialog,
	confirmDialog,
	showAlert
};
