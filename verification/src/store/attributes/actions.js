// @flow
import {ATTRIBUTE_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getAttributesData, getSubjectUuid} from 'utils/api';
import {setVerificationCode} from 'store/verification/actions';

/**
 * Получение и сохранение атрибутов
 * @returns {ThunkAction}
 */
const getAttributes = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderAttributes());

		const claimUUID = await getSubjectUuid();
		const attributes = await getAttributesData(claimUUID);
		const [attribute] = attributes;

		dispatch(setVerificationCode(attribute.code));
		dispatch(setAttributes(attributes));
	} catch (error) {
		dispatch(setErrorAttributes(error));
	} finally {
		dispatch(hideLoaderAttributes());
	}
};

/**
 * Показывает индикатор загрузки данных
 */
const showLoaderAttributes = () => ({
	type: ATTRIBUTE_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderAttributes = () => ({
	type: ATTRIBUTE_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorAttributes = (payload: string) => ({
	payload,
	type: ATTRIBUTE_EVENTS.SET_ERROR_DATA
});

/**
 * Сохраняет contentCode - код самого ВП
 * @param {string} payload - contentCode
 */
const setAttributes = (payload: string) => ({
	payload,
	type: ATTRIBUTE_EVENTS.SET_ATTRIBUTE_DATA
});

export {
	getAttributes,
	hideLoaderAttributes,
	showLoaderAttributes
};
