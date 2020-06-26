// @flow
import type {
	LinksState,
	ReceiveLink,
	RecordErrorLink,
	RequestLink
} from './types';

/**
 * Устанавливаем момент получения ссылки на данные
 * @param {LinksState} state - хранилище ссылок на данные диаграмм
 * @param {string} payload - id виджета
 * @returns {LinksState}
 */
export const setRequestLink = (state: LinksState, {payload}: RequestLink): LinksState => {
	state.map[payload] = {
		error: false,
		loading: true
	};

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Устанавливаем полученную ссылку по id
 * @param {LinksState} state - хранилище ссылок на данные диаграмм
 * @param {string} payload - id виджета
 * @returns {LinksState}
 */
export const setLink = (state: LinksState, {payload}: ReceiveLink): LinksState => {
	state.map[payload] = {
		error: false,
		loading: false
	};

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Фиксируем ошибку в случае неудачного получения ссылки
 * @param {LinksState} state - хранилище ссылок на данные диаграмм
 * @param {string} payload - id виджета
 * @returns {LinksState}
 */
export const setLinkError = (state: LinksState, {payload}: RecordErrorLink): LinksState => {
	state.map[payload] = {
		error: true,
		loading: false
	};

	return {
		...state,
		map: {...state.map}
	};
};
