// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {VerifyData} from 'store/verify/types';

const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();

/**
 * Возвращает Uuid текущего документа
 * @returns {Promise<string>} - Uuid
 */
export const getFileUuid = async (): Promise<string> => {
	return await api.getFileUuid();
};

/**
 * Возвращает текущее Uuid решения
 * @returns {Promise<string>} - Uuid
 */
export const getSubjectUuid = async (): Promise<string> => {
	return await api.getSubjectUuid();
};

/**
 * Возвращает стартовые данные для отображения *
 * @param decisionUUID - Uuid решения
 * @returns {Promise<VerifyData>} - обьект с данными
 */
export const getVerifyResult = async (decisionUUID: string): Promise<VerifyData> => {
	return await api.getVerifyResult(decisionUUID);
};

/**
 * Возвращает тело документа для проверки *
 * @param documentUUID - Uuid документа
 * @returns {Promise<VerifyData>} - обьект с данными
 */
export const getVerifyDocument = async (documentUUID: string): Promise<VerifyData> => {
	return await api.getVerifyDocument(documentUUID);
};

/**
 * Отправляет измененный статус ошибки
 * @param UUID - Uuid ошибки
 * @param status - статус
 * @param documentUUID - Uuid документа
 */
export const updateEntityStatus = async (UUID: string, status: string): Promise<void> => {
	return await api.updateEntityStatus(UUID, status);
};

/**
 * Отправляет команду на формирование документа
 * @returns {Promise<>}
 * @param documentUUID - Uuid документа
 */
export const generateDocument = async (documentUUID: string): Promise<void> => {
	return await api.generateDocument(documentUUID);
};

/**
 * Возвращает тело документа для проверки
 * @returns {Promise<VerifyData>} - обьект с данными
 * @param documentUUID - Uuid документа
 */
export const getWsDocument = async (documentUUID: string): Promise<VerifyData> => {
	return await api.getWsDocument(documentUUID);
};
