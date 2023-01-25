// @flow
import Api from './api';
import type {Context, UserData} from './types';
import type {Entity} from 'src/store/entity/types';
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
 * Возвращает массив данные для вывода на схему
 *
 * @param contentCode {string} - код контента
 * @param subjectUuid {string} - Uuid встроки
 * @param currentUser {UserData} - текущий пользователь
 * @returns {Promise<[Entity]>} - Uuid
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

/**
 * Поиск и получение списка Uuid обьектов, подходящих под запрос
 * @param {string} searchString - строка для поиска
 * @returns {Promise<[string]>} - список Uuid
 */
export const getUuidObjects = async (searchString: string): Promise<[string]> => {
	return api.getUuidObjects(searchString);
};
