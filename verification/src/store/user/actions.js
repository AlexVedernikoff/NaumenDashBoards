// @flow
import {ATTRIBUTE_EVENTS, USER_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getAttributesData} from 'utils/api';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getStartUpData = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const {data} = await getAttributesData();

		dispatch(setAttributesData(data));
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
const setAttributesData = (payload: string) => ({
	payload,
	type: ATTRIBUTE_EVENTS.SET_USER_DATA
});

export {
	getStartUpData,
	hideLoaderData,
	showLoaderData
};
