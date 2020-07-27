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
import {LAYOUT_MODE} from 'store/dashboard/constants';
import {NewWidget} from 'utils/widget';

/**
 * Устанавливаем полученные виджеты
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {Widget[]} payload - массив виджетов
 * @returns {WidgetsDataState}
 */
const setWidgets = (state: WidgetsDataState, {payload}: SetWidgets) => {
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
const setSelectedWidget = (state: WidgetsDataState, {payload}: SelectWidget): WidgetsDataState => {
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
const resetWidget = (state: WidgetsDataState): WidgetsDataState => {
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
const addWidget = (state: WidgetsDataState, {payload}: AddWidget): WidgetsDataState => {
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
const createWidget = (state: WidgetsDataState, {payload}: SetCreatedWidget): WidgetsDataState => {
	state.map[payload.id] = payload;
	state.selectedWidget = payload.id;
	state.newWidget = null;

	return {
		...state,
		map: {...state.map},
		updating: false
	};
};

/**
 * Удаляем виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {string} payload - id виджета
 * @returns {WidgetsDataState}
 */
const deleteWidget = (state: WidgetsDataState, {payload}: DeleteWidget): WidgetsDataState => {
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
const updateWidget = (state: WidgetsDataState, {payload}: UpdateWidget): WidgetsDataState => {
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
const editLayout = (state: WidgetsDataState, {payload}: EditLayout): WidgetsDataState => {
	const {layoutMode, layouts} = payload;
	const isMk = layoutMode === LAYOUT_MODE.MK;

	layouts.forEach(l => {
		if (l.i === NewWidget.id && state.newWidget) {
			isMk ? state.newWidget.mkLayout = l : state.newWidget.layout = l;
		} else {
			isMk ? state.map[l.i].mkLayout = l : state.map[l.i].layout = l;
		}
	});

	return {
		...state,
		map: state.map
	};
};

// $FlowFixMe
const getBuildSet = (widget: Widget) => widget.data.find(set => !set.sourceForCompute);

export {
	getBuildSet,
	setWidgets,
	setSelectedWidget,
	updateWidget,
	editLayout,
	addWidget,
	createWidget,
	deleteWidget,
	resetWidget
};
