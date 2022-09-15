// @flow
import type {Dispatch, Entity, ThunkAction} from 'store/types';
import {getContext, getScheme} from 'utils/api';
import {VERIFY_EVENTS} from './constants';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getDataEntity = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());
		const {contentCode, subjectUuid} = await getContext();
		const response = await getScheme(contentCode, subjectUuid);
		dispatch(setEntityData([...response.entities]));
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
	type: VERIFY_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderData = () => ({
	type: VERIFY_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorData = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_ERROR_DATA
});

/**
 * Сохраняет полученные стартовые настройки
 * @param {string} payload - contentCode
 */
const setEntityData = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_DATA
});

/**
 * Установка выбранного едемента
 * @param {string} payload - елемент
 */
const setActiveElement = (payload: Entity) => ({
	payload,
	type: VERIFY_EVENTS.SET_ACTIVE_ELEMENT
});

/**
 * Установка зума
 * @param {number} payload - зум
 */
const setScale = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_SCALE
});

/**
 * Установка экспорта
 * @param {string} payload - формат
 */
const setExportTo = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_EXPORT_TO
});

/**
 * Установка позиции холста
 * @param {{x: number, y: number}} payload - координаты
 */
const setPosition = (payload: {x: number, y: number}) => ({
	payload,
	type: VERIFY_EVENTS.SET_POSITION
});

export {
	setActiveElement,
	setScale,
	setExportTo,
	setPosition,
	getDataEntity
};
