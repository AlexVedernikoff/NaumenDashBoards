// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {generateDocument, getSubjectUuid, getVerifyDocument, getVerifyResult, updateEntityStatus} from 'utils/api';
import {VERIFY_EVENTS} from './constants';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getDataVerify = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const uuidDocument = await getSubjectUuid();
		const setting = await getVerifyResult(uuidDocument);
		const html = await getVerifyDocument(setting.document);

		dispatch(setUuidDocument(setting.document));
		dispatch(setVerifyData({...setting, html}));
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Отправляет измененный статус ошибки
 * @returns {ThunkAction}
 * @param UUID - Uuid ошибки
 * @param status - статус
 */
const sendEntityStatus = (UUID, status): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await updateEntityStatus(UUID, status);
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Отправляет команду на формирование документа
 * @returns {ThunkAction}
 */
const sendGenerateDocument = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {verify: {uuidDocument}} = getState();
		const {result} = await generateDocument(uuidDocument);

		dispatch(setNotificationData(true, result));
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

/**
 * Сохраняет UUID документа
 * @param {string} payload - contentCode
 */
const setUuidDocument = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_UUID_DOCUMENT
});

/**
 * Установка данных для сообщения о генерации документа
 * @param {boolean} show - Показать сообщение
 * @param {boolean} isSuccess - Если ошибка
 */
const setNotificationData = (show: boolean, isSuccess: boolean = false) => ({
	payload: {isSuccess, show},
	type: VERIFY_EVENTS.SET_NOTIFICATION_SHOW
});

export {
	getDataVerify,
	setVerifyData,
	sendGenerateDocument,
	sendEntityStatus,
	setNotificationData
};
