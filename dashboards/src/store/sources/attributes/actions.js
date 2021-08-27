// @flow
import api from 'api';
import type {Attribute} from './types';
import {ATTRIBUTES_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {OnLoadCallback} from 'store/sources/types';

/**
 * Преобразует атрибут в атрибут с таким же названием, но в классе classFqn
 * @param {string} classFqn - целевой код класса
 * @param {Attribute} attribute - исходный атрибут
 * @returns  {ThunkAction}
 */
const fetchAttributeByCode = (classFqn: string, attribute: Attribute): ThunkAction =>
	async (dispatch: Dispatch): Promise<Attribute | null> => {
		try {
			const params = {
				attribute,
				classFqn
			};
			const newAttribute = await api.instance.dashboards.getAttributeByCode(params);
			return newAttribute;
		} catch (error) {
			return null;
		}
	};

/**
 * Получаем атрибуты конкретного класса
 * @param {string} classFqn - код класса
 * @param {string | null} parentClassFqn - код класса родителя
 * @param {string | null} groupCode - фильтрация атрибутов по группе
 * @param {OnLoadCallback} callback - колбэк-функция
 * @returns {ThunkAction}
 */
const fetchAttributes = (classFqn: string, parentClassFqn: string | null = null, groupCode: ?string, callback?: OnLoadCallback): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		dispatch(requestAttributes(classFqn));

		try {
			const params = {
				classFqn,
				groupCode,
				parentClassFqn
			};
			const attributes = await api.instance.dashboards.getDataSourceAttributes(params);

			callback && callback(attributes);
			dispatch(receiveAttributes(attributes, classFqn));
		} catch (error) {
			dispatch(recordAttributesError(classFqn));
		}
	};

const requestAttributes = (payload: string) => ({
	payload,
	type: ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES
});

const receiveAttributes = (attributes, classFqn) => ({
	payload: {attributes, classFqn},
	type: ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES
});

const recordAttributesError = (payload: string) => ({
	payload,
	type: ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR
});

export {
	fetchAttributes,
	fetchAttributeByCode
};
