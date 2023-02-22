// @flow
import type {
	AddWidget,
	AxisData,
	CircleData,
	ClearMessageWarning,
	DeleteWidget,
	Group,
	Indicator,
	SelectWidget,
	SetCreatedWidget,
	SetMessageWarning,
	SetWidgets,
	Source,
	SourceData,
	TableData,
	UpdateWidget,
	Widget,
	WidgetType,
	WidgetsDataState
} from './types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {AxisFormat} from 'store/widgets/data/types';
import {AXIS_FORMAT_TYPE, DEFAULT_AXIS_FORMAT} from 'store/widgets/data/constants';
import {DEFAULT_AGGREGATION, INTEGER_AGGREGATION} from 'store/widgets/constants';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {GROUP_WAYS} from 'src/store/widgets/constants';
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
const getComboYAxisName = (
	source: Source | null,
	indicators: Array<Indicator>,
	yAxisName: string = ''
): string => {
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
function getMainDataSet<T: Object> (data: $ReadOnlyArray<T>): T {
	return data.find(dataSet => !dataSet.sourceForCompute) || data[0];
}

/**
 * Возвращает индекс набора данных главного источника
 * @template T
 * @param {Array<T>} data - массив набора данных виджета для построения
 * @returns {number}
 */
function getMainDataSetIndex <T: Object> (data: $ReadOnlyArray<T>): number {
	return data.findIndex(dataSet => !dataSet.sourceForCompute) || 0;
}

/**
 * Создает ключ ключ пользовательских настроек цветов основанный на переданных значениях
 * @param {Source} source - источник
 * @param {Attribute} attribute - атрибут
 * @param {Group} group - группировка атрибута
 * @returns {string | null}
 */
const createCustomColorsSettingsKey = (
	source: Source,
	attribute: Attribute,
	group: Group
): string | null => {
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
const getCustomColorsSettingsKeyByData = (
	data: Array<AxisData | CircleData>,
	type: WidgetType = WIDGET_TYPES.BAR
): string | null => {
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
const setWidgetWarning = (
	state: WidgetsDataState,
	{payload}: SetMessageWarning
): WidgetsDataState => ({
	...state,
	map: {
		...state.map,
		[payload.id]: {
			...state.map[payload.id],
			warningMessage: payload.message
		}
	}
});

/**
 * Устанавливаем ошибку на виджет
 * @param {WidgetsDataState} state - хранилище данных виджетов
 * @param {ClearMessageWarning} payload - id виджета
 * @returns {WidgetsDataState}
 */
const clearWidgetWarning = (
	state: WidgetsDataState,
	{payload}: ClearMessageWarning
): WidgetsDataState => {
	const {warningMessage, ...newPayload} = state.map[payload];

	return {
		...state,
		map: {
			...state.map,
			[payload]: newPayload
		}
	};
};

/**
 * Получение формата по умолчанию по параметру/разбивке
 * @param {Attribute | null} attribute - атрибут параметра/разбивки
 * @param {Group | null} group - группировка параметра/разбивки
 * @returns {AxisFormat} - формат по умолчанию
 */
const getDefaultFormatForParameter = (
	attribute: Attribute | null,
	group: Group | null
): AxisFormat | null => {
	let format = null;

	const {
		catalogItem,
		catalogItemSet,
		double,
		integer,
		state
	} = ATTRIBUTE_TYPES;

	if (attribute && group?.way === GROUP_WAYS.SYSTEM) {
		const type = getAttributeValue(attribute, 'type');

		switch (type) {
			case catalogItem:
			case catalogItemSet:
			case state:
				format = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.LABEL_FORMAT];
				break;
			case double:
				format = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.NUMBER_FORMAT];
				break;
			case integer:
				format = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.INTEGER_FORMAT];
				break;
		}
	}

	return format;
};

/**
 * Получение типа форматирования по индикатору
 * @param {Indicator} indicator - индикатор
 * @returns {AxisFormat} - тип форматирования
 */
const getDefaultFormatForIndicator = (indicator: Indicator): AxisFormat => {
	let result = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.NUMBER_FORMAT];
	const {aggregation, attribute} = indicator;

	if (aggregation === DEFAULT_AGGREGATION.COUNT) {
		result = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.INTEGER_FORMAT];
	}

	if (aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE) {
		result = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.LABEL_FORMAT];
	}

	if (attribute?.type === ATTRIBUTE_TYPES.dtInterval && aggregation in INTEGER_AGGREGATION) {
		result = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT];
	}

	return result;
};

/**
 * Возвращает реальный дескриптор из источника
 * @param {SourceData} source - источник
 * @param {Array}  filters - список фильтров
 * @returns {string} - дескриптор
 */
const getSourceDescriptor = (
	source: SourceData,
	filters: Array<{descriptor: string, id: string}>
) => {
	const {descriptor, filterId} = source;
	let result = descriptor;

	if (filterId) {
		const filter = filters.find(item => item.id === filterId);

		if (filter) {
			result = filter.descriptor;
		}
	}

	return result;
};

/**
 * Проверяет, что источник вычисляется как одна строка, без применения параметров
 * @param {?TableData} dataSet - источник
 * @returns {boolean} - возвращает true, если источник установлен и вычисляется как одна строка, иначе false
 */
const isDontUseParamsForDataSet = (
	dataSet: ?TableData
) => dataSet && typeof dataSet.sourceRowName === 'string';

export {
	addWidget,
	clearWidgetWarning,
	createWidget,
	deleteWidget,
	getBuildSet,
	getComboYAxisName,
	getCustomColorsSettingsKey,
	getCustomColorsSettingsKeyByData,
	getDefaultFormatForParameter,
	getDefaultFormatForIndicator,
	getMainDataSet,
	getMainDataSetIndex,
	getSourceDescriptor,
	isDontUseParamsForDataSet,
	resetWidget,
	setSelectedWidget,
	setWidgets,
	setWidgetWarning,
	updateWidget
};
