// @flow
import type {
	AddWidget,
	DeleteWidget,
	EditLayout,
	SelectWidget,
	SetCreatedWidget,
	SetWidgets,
	UpdateWidget,
	Widget,
	WidgetsDataState
} from './types';
import type {Layout} from 'utils/layout/types';
import {NewWidget} from 'utils/widget';

/**
 * Устанавливаем полученные виджеты
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {Widget[]} payload - массив виджетов
 * @returns {WidgetsDataState}
 */
export const setWidgets = (state: WidgetsDataState, {payload}: SetWidgets) => {
	const map = {};

	payload.forEach(widget => {
		if (typeof widget === 'object' && widget !== null) {
			map[widget.id] = widget;
		}
	});

	return {
		...state,
		loading: false,
		map
	};
};

/**
 * Устанавливаем выбранный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {string} payload - id виджета
 * @returns {WidgetsDataState}
 */
export const setSelectedWidget = (state: WidgetsDataState, {payload}: SelectWidget): WidgetsDataState => {
	if (state.selectedWidget === NewWidget.id) {
		state.newWidget = null;
	}

	return {
		...state,
		selectedWidget: payload
	};
};

/**
 * Сбрасываем выбранный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @returns {WidgetsDataState}
 */
export const resetWidget = (state: WidgetsDataState): WidgetsDataState => {
	if (state.selectedWidget === NewWidget.id) {
		state.newWidget = null;
	}

	return {
		...state,
		selectedWidget: ''
	};
};

/**
 * Добавляем новый виджет
 * @param  {WidgetsDataState} state - хранилище данных виджетов - состояние хранилища
 * @param {NewWidget} payload - объект нового виджета
 * @returns {WidgetsDataState}
 */
export const addWidget = (state: WidgetsDataState, {payload}: AddWidget): WidgetsDataState => {
	state.newWidget = payload;
	state.selectedWidget = state.newWidget.id;

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Создаем полноценный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {Widget} payload - данные виджета
 * @returns {WidgetsDataState}
 */
export const createWidget = (state: WidgetsDataState, {payload}: SetCreatedWidget): WidgetsDataState => {
	state.map[payload.id] = payload;
	state.selectedWidget = payload.id;
	state.newWidget = null;

	return {
		...state,
		updating: false,
		map: {...state.map}
	};
};

/**
 * Удаляем виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {string} payload - id виджета
 * @returns {WidgetsDataState}
 */
export const deleteWidget = (state: WidgetsDataState, {payload}: DeleteWidget): WidgetsDataState => {
	delete state.map[payload];

	if (state.selectedWidget === payload) {
		state.selectedWidget = '';
	}

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Сохраняем изменения данных виджета
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {Widget} payload - данные виджета
 * @returns {WidgetsDataState}
 */
export const updateWidget = (state: WidgetsDataState, {payload}: UpdateWidget): WidgetsDataState => {
	state.map[payload.id] = payload;

	return {
		...state,
		map: {...state.map},
		updating: false
	};
};

/**
 * Сохраняем изменения положений виджетов
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {Layout} payload - массив объектов положений виджетов на дашборде
 * @returns {WidgetsDataState}
 */
export const editLayout = (state: WidgetsDataState, {payload}: EditLayout): WidgetsDataState => {
	payload.forEach(l => {
		if (l.i === NewWidget.id && state.newWidget) {
			state.newWidget.layout = l;
		} else {
			state.map[l.i].layout = l;
		}
	});

	return {
		...state,
		map: state.map
	};
};
