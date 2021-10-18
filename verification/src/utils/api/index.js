// @flow
import Api from './api';
import {AttributesData} from 'store/attributes/types';
import FakeApi from './fakeApi';
import {SettingData} from 'store/setting/types';
import {UserData} from 'store/user/types';

const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();

/**
 * Возвращает атрибуты проверок
 * @returns {Promise<AttributesData>} - атрибуты
 */
export const getAttributesData = async (): Promise<AttributesData> => {
	return await api.getAttributesData();
};

/**
 * Возвращает текущего пользователя
 *
 * @returns {Promise<UserData>} - пользователь
 */
export const getCurrentUser = async (): Promise<UserData> => {
	return await api.getCurrentUser();
};

/**
 * Возвращает стартовые настройки
 *
 * @returns {Promise<SettingData>} - настройки
 * @param claimUUID
 * @param user
 */
export const getStartSettings = async (claimUUID: string, user: UserData): Promise<SettingData> => {
	return await api.getStartSettings(claimUUID, user);
};

/**
 * Возвращает текущее Uuid обращения
 *
 * @returns {Promise<UserData>} - Uuid
 */
export const getSubjectUuid = async (): Promise<string> => {
	return await api.getSubjectUuid();
};
