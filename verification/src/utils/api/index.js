// @flow
import Api from './api';
import {AttributesData} from 'store/attributes/types';
import FakeApi from './fakeApi';
import {SettingData} from 'store/setting/types';
import {UserData} from 'store/user/types';

const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();

/**
 * Возвращает атрибуты проверок
 * @param claimUUID - Uuid
 * @returns {Promise<AttributesData>} - атрибуты
 */
export const getAttributesData = async (claimUUID: string): Promise<AttributesData> => {
	return await api.getAttributesData(claimUUID);
};

/**
 * Возвращает текущего пользователя
 * @returns {Promise<UserData>} - пользователь
 */
export const getCurrentUser = async (): Promise<UserData> => {
	return await api.getCurrentUser();
};

/**
 * Возвращает стартовые настройки
 * @returns {Promise<SettingData>} - настройки
 * @param claimUUID - Uuid
 * @param user - Пользователь
 */
export const getStartSettings = async (claimUUID: string, user: UserData): Promise<SettingData> => {
	return await api.getStartSettings(claimUUID, user);
};

/**
 * Возвращает текущее Uuid обращения
 * @returns {Promise<string>} - Uuid
 */
export const getSubjectUuid = async (): Promise<string> => {
	return await api.getSubjectUuid();
};

/**
 * Отправляет на проверку и возвращает статус
 * @returns {Promise<{isFullChecked, message}>} - Сообщение и статус дальнейшей проверки
 * @param claimUUID - Uuid
 * @param code - Код атрибута
 * @param values Значения атрибута
 */
export const setValueAndTaskState = async (claimUUID: string, code: string, values: AttributesData): Promise<string> => {
	return await api.setValueAndTaskState(claimUUID, code, values);
};
