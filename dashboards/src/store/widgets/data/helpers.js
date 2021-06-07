// @flow
import type {
	AddWidget,
	AnyWidget,
	AxisData,
	AxisWidget,
	CircleData,
	CircleWidget,
	ClearMessageWarning,
	DeleteWidget,
	Group,
	Indicator,
	SelectWidget,
	SetCreatedWidget,
	SetMessageWarning,
	SetWidgets,
	Source,
	UpdateWidget,
	Widget,
	WidgetType,
	WidgetsDataState
} from './types';
import type {AppState} from 'store/types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {getWidgetGlobalChartColorsSettings} from 'store/dashboard/customChartColorsSettings/selectors';
import NewWidget from 'store/widgets/data/NewWidget';
import {WIDGET_SETS, WIDGET_TYPES} from './constants';

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

const getBuildSet = ({data}: Object) => data.find(set => !set.sourceForCompute) || data[0];

/**
 * Возвращает название оси Y по умолчанию для осевых графиков
 * @param {Source} source - источник
 * @param {Array<Indicator>} indicators - показатели
 * @param {string} yAxisName - название оси Y
 * @returns {string}
 */
const getComboYAxisName = (source: Source | null, indicators: Array<Indicator>, yAxisName: string = ''): string => {
	const {attribute} = indicators[0];
	let name = yAxisName;

	if (!name && attribute && source) {
		name = `${getAttributeValue(attribute, 'title')} (${source.label})`;
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

/**
 * Создает ключ ключ пользовательских настроек цветов основанный на переданных значениях
 * @param {Source} source - источник
 * @param {Attribute} attribute - атрибут
 * @param {Group} group - группировка атрибута
 * @returns {string | null}
 */
const createCustomColorsSettingsKey = (source: Source, attribute: Attribute, group: Group): string | null => {
	let key = '';

	if (attribute && attribute.type in ATTRIBUTE_SETS.REFERENCE) {
		const targetAttribute = attribute.ref || attribute;

		key = targetAttribute && group ? `${targetAttribute.property}-${targetAttribute.code}-${group.data}` : null;
	} else {
		key = source && attribute && group ? `${source.value}-${attribute.code}-${group.data}` : null;
	}

	if (key && group.format) {
		key = `${key}-${group.format}`;
	}

	return key;
};

/**
 * Возвращает ключ пользовательских настроек цветов основанный на данных виджета
 * @param {Array<AxisData | CircleData>} widget - график
 * @returns {string | null}
 */
const getCustomColorsSettingsKey = (widget: Widget): string | null => {
	const {AXIS: AXIS_TYPES, CIRCLE: CIRCLE_TYPES} = WIDGET_SETS;
	const {type} = widget;
	let key = null;

	if (!(widget instanceof NewWidget) && (type in AXIS_TYPES || type in CIRCLE_TYPES)) {
		// $FlowFixMe
		const data: Array<AxisData | CircleData> = widget.data;

		key = getCustomColorsSettingsKeyByData(data, type);
	}

	return key;
};

/**
 * Возвращает ключ пользовательских настроек цветов
 * @param {Array<AxisData | CircleData>} data - график
 * @param {WidgetType} type - тип виджета
 * @returns {string | null}
 */
const getCustomColorsSettingsKeyByData = (data: Array<AxisData | CircleData>, type: WidgetType = WIDGET_TYPES.BAR): string | null => {
	// $FlowFixMe[prop-missing]
	const {breakdown, parameters, source} = getMainDataSet(data);
	let key = null;

	if (Array.isArray(breakdown)) {
		const {attribute, group} = breakdown[0];

		key = createCustomColorsSettingsKey(source.value, attribute, group);
	} else if (type !== WIDGET_TYPES.LINE && Array.isArray(parameters)) {
		const {attribute, group} = parameters[0];

		key = createCustomColorsSettingsKey(source.value, attribute, group);
	}

	return key;
};

/**
 * Устанавливаем ошибку на виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {SetMessageWarning} payload - данные об ошибке
 * @returns {WidgetsDataState}
 */
const setWidgetWarning = (state: WidgetsDataState, {payload}: SetMessageWarning): WidgetsDataState => {
	return {
		...state,
		map: {
			...state.map,
			[payload.id]: {
				...state.map[payload.id],
				warningMessage: payload.message
			}
		}
	};
};

/**
 * Устанавливаем ошибку на виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {ClearMessageWarning} payload - id виджета
 * @returns {WidgetsDataState}
 */
const clearWidgetWarning = (state: WidgetsDataState, {payload}: ClearMessageWarning): WidgetsDataState => {
	const {warningMessage, ...newPayload} = state.map[payload];

	return {
		...state,
		map: {
			...state.map,
			[payload]: newPayload
		}
	};
};

const updateNewWidgetCustomColorsSettings = (awidget: AnyWidget, state: AppState) => {
	let isChanged = false;

	if (awidget.type !== WIDGET_TYPES.TEXT) {
		// $FlowFixMe: это не WIDGET_TYPES.TEXT => Widget
		const widget = (awidget: Widget);
		const settings = getWidgetGlobalChartColorsSettings(widget)(state);

		if (settings) {
			// $FlowFixMe: getWidgetGlobalChartColorsSettings проверяет на то что это AxisWidget или CircleWidget
			const colorWidget = (widget: AxisWidget | CircleWidget);
			const colorsSettings = colorWidget.colorsSettings;

			if (colorsSettings && !colorsSettings.custom.useGlobal) {
				colorWidget.colorsSettings = {
					...colorsSettings,
					custom: {
						data: {...settings},
						useGlobal: true
					},
					type: CHART_COLORS_SETTINGS_TYPES.CUSTOM
				};
				isChanged = true;
			}
		}
	}

	return isChanged;
};

export {
	addWidget,
	clearWidgetWarning,
	createWidget,
	deleteWidget,
	getBuildSet,
	getComboYAxisName,
	getCustomColorsSettingsKey,
	getCustomColorsSettingsKeyByData,
	getMainDataSet,
	getMainDataSetIndex,
	resetWidget,
	setSelectedWidget,
	setWidgets,
	setWidgetWarning,
	updateNewWidgetCustomColorsSettings,
	updateWidget
};
