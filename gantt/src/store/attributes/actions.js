// @flow
import {ATTRIBUTES_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getDataAttributesControlPointStatus, getDataSourceAttributes, getDataSourceAttributesByTypes} from 'utils/api';
import type {OnLoadCallback} from 'store/sources/types';

/**
 * Получаем атрибуты конкретного класса
 * @param {string} classFqn - код класса
 * @param {string | null} parentClassFqn - код класса родителя
 * @param {OnLoadCallback} callback - колбэк-функция
 * @returns {ThunkAction}
 */
const fetchAttributes = (classFqn: string, parentClassFqn: string | null = null, callback?: OnLoadCallback): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		dispatch(requestAttributes(classFqn));

		try {
			const attributes = await getDataSourceAttributes(classFqn, parentClassFqn);

			callback && callback(attributes);
			dispatch(receiveAttributes(attributes, classFqn));
		} catch (error) {
			dispatch(recordAttributesError(classFqn));
		}
	};

const fetchAttributesMilestones = (classFqn: string, parentClassFqn: string | null = null, callback?: OnLoadCallback): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		dispatch(requestAttributes(classFqn));

		try {
			const attributesMilestones = await getDataAttributesControlPointStatus(classFqn, parentClassFqn);

			callback && callback(attributesMilestones);
			dispatch(receiveAttributesMilestone(attributesMilestones));
		} catch (error) {
			dispatch(recordAttributesError(classFqn));
		}
	};

/**
 * Получаем атрибуты конкретного класса по типам
 * @param {string} classFqn - код класса
 * @param {string | null} types - типы
 * @param {OnLoadCallback} callback - колбэк-функция
 * @returns {ThunkAction}
 */
const fetchAttributesByTypes = (classFqn: string, types: Array<String> | null = null, callback?: OnLoadCallback): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		dispatch(requestAttributes(classFqn));
		try {
			const attributes = await getDataSourceAttributesByTypes(classFqn, types);

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

const receiveAttributesMilestone = payload => ({
	payload,
	type: ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES_MILISTONE
});

const recordAttributesError = (payload: string) => ({
	payload,
	type: ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR
});

export {
	fetchAttributes,
	fetchAttributesByTypes,
	fetchAttributesMilestones
};
