// @flow
import type {
	AddWidget,
	DeleteWidget,
	SelectWidget,
	SetCreatedWidget,
	SetWidgets,
	UpdateWidget,
	Widget,
	WidgetType,
	WidgetsDataState
} from './types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import DiagramWidget from './templates/DiagramWidget';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import type {LayoutMode} from 'store/dashboard/settings/types';
import NewWidget from 'store/widgets/data/NewWidget';
import TextWidget from './templates/TextWidget';
import {WIDGET_TYPES} from './constants';

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
		map
	};
};

/**
 * Устанавливаем выбранный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {string} payload - id виджета
 * @returns {WidgetsDataState}
 */
const setSelectedWidget = (state: WidgetsDataState, {payload}: SelectWidget): WidgetsDataState => ({
		...state,
		selectedWidget: payload
});

/**
 * Сбрасываем выбранный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @returns {WidgetsDataState}
 */
const resetWidget = (state: WidgetsDataState): WidgetsDataState => {
	delete state.map[NewWidget.id];

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
	state.selectedWidget = payload.id;

	return {
		...state,
		map: {
			...state.map,
			[payload.id]: payload
		}
	};
};

/**
 * Создаем полноценный виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {Widget} payload - данные виджета
 * @returns {WidgetsDataState}
 */
const createWidget = (state: WidgetsDataState, {payload}: SetCreatedWidget): WidgetsDataState => {
	delete state.map[NewWidget.id];

	return {
		...state,
		map: {
			...state.map,
			[payload.id]: payload
		},
		saving: {
			...state.saving,
			loading: false
		},
		selectedWidget: payload.id
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
		saving: {
			...state.saving,
			loading: false
		}
	};
};

// $FlowFixMe
const getBuildSet = ({data}: Object) => data.find(set => !set.sourceForCompute) || data[0];

const createNewWidget = (layoutMode: LayoutMode, type: WidgetType = WIDGET_TYPES.BAR) => {
	const {
		BAR,
		BAR_STACKED,
		COLUMN,
		COLUMN_STACKED,
		COMBO,
		DONUT,
		LINE,
		PIE,
		SPEEDOMETER,
		SUMMARY,
		TABLE,
		TEXT
	} = WIDGET_TYPES;

	switch (type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case COMBO:
		case DONUT:
		case LINE:
		case PIE:
		case SPEEDOMETER:
		case SUMMARY:
		case TABLE:
			return new DiagramWidget(layoutMode);
		case TEXT:
			return new TextWidget(layoutMode);
	}
};

/**
 * Возвращает название оси Y по умолчанию для осевых графиков
 * @param {DataSet} dataSet - набор данных виджета для построения
 * @returns {string}
 */
const getDefaultComboYAxisName = (dataSet: DataSet): string => {
	const {indicators, source} = dataSet;
	const {attribute} = indicators[0];
	const {value: sourceValue} = source;
	let name = '';

	if (attribute && sourceValue) {
		name = `${getAttributeValue(attribute, 'title')} (${sourceValue.label})`;
	}

	return name;
};

/**
 * Возвращает набор данных главного источника
 * @template T
 * @param {Array<T>} data - массив набора данных виджета для построения
 * @returns {T}
 */
const getMainDataSet = <T: Object>(data: $ReadOnlyArray<T>): T => {
	return data.find(dataSet => !dataSet.sourceForCompute) || data[0];
};

/**
 * Возвращает индекс набора данных главного источника
 * @template T
 * @param {Array<T>} data - массив набора данных виджета для построения
 * @returns {number}
 */
const getMainDataSetIndex = <T: Object>(data: $ReadOnlyArray<T>): number => {
	return data.findIndex(dataSet => !dataSet.sourceForCompute) || 0;
};

export {
	createNewWidget,
	getBuildSet,
	getDefaultComboYAxisName,
	getMainDataSet,
	getMainDataSetIndex,
	setWidgets,
	setSelectedWidget,
	updateWidget,
	addWidget,
	createWidget,
	deleteWidget,
	resetWidget
};
