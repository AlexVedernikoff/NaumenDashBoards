// @flow
import type {Dispatch, ThunkAction} from 'store/types';
import {getSubjectUuid, getVerifyDocument, getVerifyResult, getWsDocument} from 'utils/api';
import {VERIFY_EVENTS} from './constants';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getDataVerify = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const decisionUUID = await getSubjectUuid();
		const setting = await getVerifyResult(decisionUUID);
		const html = await getVerifyDocument(setting.document);

		await getWsDocument(setting.document);

		dispatch(setVerifyData({...setting, html}));
	} catch (error) {
		console.error(error);
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Показывает индикатор загрузки данных
 */
const showLoaderData = () => ({
	type: VERIFY_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderData = () => ({
	type: VERIFY_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorData = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_ERROR_DATA
});

/**
 * Сохраняет полученные стартовые настройки
 * @param {string} payload - contentCode
 */
const setVerifyData = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_VERIFY_DATA
});

export {
	getDataVerify
};