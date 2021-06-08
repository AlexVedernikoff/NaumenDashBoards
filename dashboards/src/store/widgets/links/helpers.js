// @flow
import type {
	DrillDownMixin,
	LinksState,
	ReceiveLink,
	RecordErrorLink,
	RequestLink
} from './types';
import {getDescriptorCases} from 'store/helpers';
import {isSourceType} from 'store/sources/data/helpers';
import type {Widget} from 'store/widgets/data/types';

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

/**
 * Создает примесь для формирования списка данных
 * @param {Widget} widget - виджет
 * @returns {DrillDownMixin}
 */
const createDrillDownMixin = (widget: Widget) => {
	const {header, name} = widget;
	const {name: headerName, useName} = header;

	return {
		filters: [],
		title: useName ? name : headerName
	};
};

const getPartsClassFqn = (code?: string) => {
	const cases = [];
	let classFqn = code;

	if (classFqn && isSourceType(classFqn)) {
		cases.push(...getDescriptorCases(classFqn).map(type => type.split('$')[1]));
		classFqn = classFqn.split('$')[0];
	}

	return {
		cases,
		classFqn
	};
};

export {
	getPartsClassFqn,
	createDrillDownMixin
};
