// @flow
import Api from './api';
import type {Context} from './types';
import FakeApi from './fakeApi';

const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();

/**
 * Получаем контекст встроенного приложения.
 * subjectUuid - код объекта, куда встроенно ВП.
 * contentCode - код самого ВП.
 * @returns {Context}
 */
export const getContext = async (): Promise<Context> => {
	return api.getContext();
};

/**
 * Возвращает Entity для вывода схемы
 * @returns {Promise<string>} - Uuid
 */
export const getScheme = async (contentCode: string, subjectUuid: string): Promise<string> => {
	return api.getScheme(contentCode, subjectUuid);
};
