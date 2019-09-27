// @flow
import type {
	AddWidget,
	DeleteWidget,
	EditLayout,
	ReceiveWidgets,
	SelectWidget,
	SetCreatedWidget,
	UpdateWidget,
	Widget,
	WidgetsDataState
} from './types';
import type {Layout} from 'utils/layout/types';
import {NewWidget} from 'entities';

export const setWidgets = (state: WidgetsDataState, {payload}: ReceiveWidgets) => {
	payload.forEach(w => {
		state.map[w.id] = w;
	});

	return {
		...state,
		loading: false,
		map: {...state.map}
	};
};

/**
 * Меняем статичность виджетов
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {boolean} staticValue - новое значение статичности виджетов
 * @returns {WidgetsDataState}
 */
export const handleStatic = (state: WidgetsDataState, staticValue: boolean): WidgetsDataState => {
	Object.keys(state.map).forEach(key => {
		state.map[key].layout.static = staticValue;
	});

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Устанавливаем выбранный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {string} payload - id виджета
 * @returns {WidgetsDataState}
 */
export const setSelectedWidget = (state: WidgetsDataState, {payload}: SelectWidget): WidgetsDataState => {
	state.selectedWidget = payload;
	return {...state};
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
	state.selectedWidget = '';
	return {...state};
};

/**
 * Добавляем новый виджет
 * @param  {WidgetsDataState} state - хранилище данных виджетов - состояние хранилища
 * @param {number} payload - номер новой строки
 * @returns {WidgetsDataState}
 */
export const addWidget = (state: WidgetsDataState, {payload}: AddWidget): WidgetsDataState => {
	state.newWidget = new NewWidget(payload);
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
		saveLoading: false,
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
	state.selectedWidget === NewWidget.id ? state.newWidget = null : delete state.map[payload];

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
		saveLoading: false,
		map: {...state.map}
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
		layoutSaveLoading: false,
		map: {...state.map}
	};
};
