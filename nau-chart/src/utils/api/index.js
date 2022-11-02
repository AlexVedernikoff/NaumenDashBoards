// @flow
import Api from './api';
import type {Context, UserData} from './types';
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
export const getScheme = async (contentCode: string, subjectUuid: string, currentUser: UserData): Promise<string> => {
	return api.getScheme(contentCode, subjectUuid, currentUser);
};

/**
 * Вызывает форму для редактирования и возвращает Uuid редактируемого элемента
 * @param {string} objectUUID - uuid обьекта
 * @param {string} codeEditingForm - код формы
 * @returns {Promise<{uuid: string|null}>} - Uuid
 */
export const getEditForm = async (objectUUID: string, codeEditingForm: string): Promise<string> => {
	return api.getEditForm(objectUUID, codeEditingForm);
};
