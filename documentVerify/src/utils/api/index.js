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
 * Возвращает стартовые данные для отображения
 * @returns {Promise<VerifyData>} - обьект с данными
 * @param decisionUUID - Uuid решения
 */
export const getVerifyResult = async (decisionUUID: string): Promise<VerifyData> => {
	return await api.getVerifyResult(decisionUUID);
};
