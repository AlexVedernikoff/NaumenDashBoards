// @flow
import type {
	AddWidget,
	AxisWidget,
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
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import type { DataSet, SourceData } from 'store/widgets/data/types';
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
 * Создает ключ ключ пользовательских настроек цветов основанный на данных виджета для осевых графиков
 * @param {AxisWidget} widget - осевой график
 * @returns {string | null}
 */
const createCustomAxisChartColorsSettingsKey = (widget: AxisWidget): string | null => {
	const {breakdown, parameters, source} = getMainDataSet(widget.data);
	let key = null;

	if (Array.isArray(breakdown)) {
		const {attribute, group} = breakdown[0];

		key = createCustomColorsSettingsKey(source.value, attribute, group);
	} else if (widget.type !== WIDGET_TYPES.LINE && Array.isArray(parameters)) {
		const {attribute, group} = parameters[0];

		key = createCustomColorsSettingsKey(source.value, attribute, group);
	}

	return key;
};

/**
 * Создает ключ ключ пользовательских настроек цветов основанный на данных виджета для круговых графиков
 * @param {CircleWidget} widget - осевой график
 * @returns {string | null}
 */
const createCustomCircleChartColorsSettingsKey = (widget: CircleWidget): string | null => {
	const {breakdown, source} = getMainDataSet(widget.data);
	let key = null;

	if (Array.isArray(breakdown)) {
		const {attribute, group} = breakdown[0];

		key = createCustomColorsSettingsKey(source.value, attribute, group);
	}

	return key;
};

/**
 * Возвращает ключ пользовательских настроек цветов основанный на данных виджета
 * @param {AxisWidget | CircleWidget} widget - график
 * @returns {string | null}
 */
const getCustomColorsSettingsKey = (widget: Widget): string | null => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, DONUT, LINE, PIE} = WIDGET_TYPES;

	switch (widget.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return createCustomAxisChartColorsSettingsKey(widget);
		case DONUT:
		case PIE:
			return createCustomCircleChartColorsSettingsKey(widget);
		default:
			return null;
	}
};

/**
 * Формирует новый источник с указанным пользовательским фильтром
 *
 * @param {DataSet} dataSet - источник
 * @param {number} filterIndex - порядковый номер фильтра
 * @param {string} descriptor - новый дескриптор
 * @returns {DataSet}
 */
const generateUpdatedDataSetCustomFilters = (dataSet: DataSet, filterIndex: number, descriptor: string): DataSet => {
	const {source: oldSource} = dataSet;
	const {widgetFilterOptions: oldWidgetFilterOptions} = oldSource;

	if (oldWidgetFilterOptions) {
		const widgetFilterOptions = [
			...oldWidgetFilterOptions.slice(0, filterIndex),
			{...oldWidgetFilterOptions[filterIndex], descriptor},
			...oldWidgetFilterOptions.slice(filterIndex + 1)
		];
		const source: SourceData = { ...oldSource, widgetFilterOptions };
		return { ...dataSet, source };
	}

	return dataSet;
};

/**
 * Формирует новый массив источников для виджета с указанным пользовательским фильтром
 * @param {Widget} widget - виджет
 * @param {number} dataSetIndex - индекс источника
 * @param {number} filterIndex - порядковый номер фильтра
 * @param {string} descriptor - новый дескриптор
 * @returns {DataSet}
 */
const generateUpdatedWidgetCustomFilters = (widget: Widget, dataSetIndex: number, filterIndex: number, descriptor: string): Array<DataSet> => {
	const {data} = widget;
	return [
		...data.slice(0, dataSetIndex),
		generateUpdatedDataSetCustomFilters(data[dataSetIndex], filterIndex, descriptor),
		...data.slice(dataSetIndex + 1)
	];
};

/**
 * Формирует новый источник с очищенными пользовательскими филльтрами
 * @param {DataSet} dataSet - источник
 * @returns {DataSet} - очищенный источник
 */
const generateClearedDataSetCustomFilters = (dataSet: DataSet): DataSet => {
	const {source: oldSource} = dataSet;
	const {widgetFilterOptions: oldWidgetFilterOptions} = oldSource;

	if (oldWidgetFilterOptions) {
		const widgetFilterOptions = oldWidgetFilterOptions.map((filter) => ({ ...filter, descriptor: '' }));

		const source: SourceData = { ...oldSource, widgetFilterOptions };
		return { ...dataSet, source };
	}

	return dataSet;
};

/**
 * Сформировать новый массив источников для виджета с очищенными пользовательским филльтром
 * @param {Widget} widget - виджет
 * @returns {Array<DataSet>}
 */
const generateClearedWidgetCustomFilters = (widget: Widget): Array<DataSet> => {
	const {data} = widget;
	return data.map(generateClearedDataSetCustomFilters);
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

export {
	createNewWidget,
	clearWidgetWarning,
	getBuildSet,
	getCustomColorsSettingsKey,
	getComboYAxisName,
	getMainDataSet,
	getMainDataSetIndex,
	generateClearedWidgetCustomFilters,
	generateUpdatedWidgetCustomFilters,
	setWidgetWarning,
	setWidgets,
	setSelectedWidget,
	updateWidget,
	addWidget,
	createWidget,
	deleteWidget,
	resetWidget
};
