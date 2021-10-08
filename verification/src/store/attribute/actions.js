// @flow
import {ATTRIBUTE_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getAttributeData} from 'utils/api';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getAttributeData = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const {data} = await getAttributeData();

		dispatch(setAttributeData(data));
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Показывает индикатор загрузки данных
 */
const showLoaderData = () => ({
	type: ATTRIBUTE_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderData = () => ({
	type: ATTRIBUTE_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorData = (payload: string) => ({
	payload,
	type: ATTRIBUTE_EVENTS.SET_ERROR_DATA
});

/**
 * Сохраняет contentCode - код самого ВП
 * @param {string} payload - contentCode
 */
const setAttributeData = (payload: string) => ({
	payload,
	type: ATTRIBUTE_EVENTS.SET_ATTRIBUTE_DATE
});

export {
	getAttributeData,
	hideLoaderData,
	showLoaderData,
};
