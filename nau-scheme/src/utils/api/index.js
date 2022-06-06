// @flow
import Api from './api';
import FakeApi from './fakeApi';

const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();

/**
 * Возвращает Entity для вывода схемы
 * @returns {Promise<string>} - Uuid
 */
export const getEntity = async (): Promise<string> => {
	return api.getEntity();
};
