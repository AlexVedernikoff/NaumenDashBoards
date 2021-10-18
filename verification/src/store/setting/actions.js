// @flow

import type {Dispatch, ThunkAction} from 'store/types';
import {getCurrentUser, getStartSettings, getSubjectUuid} from 'utils/api';
import {SETTING_EVENTS} from './constants';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getSetting = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const claimUUID = await getSubjectUuid();
		const user = await getCurrentUser();
		const setting = await getStartSettings(claimUUID, user);

		dispatch(setSettingsData(setting));
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Показывает индикатор загрузки данных
 */
const showLoaderData = () => ({
	type: SETTING_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderData = () => ({
	type: SETTING_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorData = (payload: string) => ({
	payload,
	type: SETTING_EVENTS.SET_ERROR_DATA
});

/**
 * Сохраняет contentCode - код самого ВП
 * @param {string} payload - contentCode
 */
const setSettingsData = (payload: string) => ({
	payload,
	type: SETTING_EVENTS.SET_SETTING_DATA
});

export {
	getSetting,
	hideLoaderData,
	showLoaderData
};
