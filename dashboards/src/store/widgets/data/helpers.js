// @flow
import type {
	AddWidget,
	AxisWidget,
	CircleWidget,
	CustomChartColorsSettingsType,
	DeleteWidget,
	Group,
	Indicator,
	SelectWidget,
	SetCreatedWidget,
	SetWidgets,
	Source,
	UpdateWidget,
	Widget,
	WidgetType,
	WidgetsDataState
} from './types';
import type {Attribute} from 'store/sources/attributes/types';
import {CUSTOM_CHART_COLORS_SETTINGS_TYPES, WIDGET_TYPES} from './constants';
import DiagramWidget from './templates/DiagramWidget';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import type {LayoutMode} from 'store/dashboard/settings/types';
import NewWidget from 'store/widgets/data/NewWidget';
import TextWidget from './templates/TextWidget';

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
 * Возвращает тип пользовательских настроек цветов основанный на данных виджета
 * @param {AxisWidget | CircleWidget} widget - график
 * @returns {CustomChartColorsSettingsType}
 */
const getCustomColorsSettingsType = (widget: $ReadOnly<Widget>): CustomChartColorsSettingsType => {
	const {data, type} = widget;
	const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = WIDGET_TYPES;
	const {BREAKDOWN, LABEL} = CUSTOM_CHART_COLORS_SETTINGS_TYPES;

	return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE].includes(type) || getMainDataSet(data).breakdown ? BREAKDOWN : LABEL;
};

/**
 * Создает ключ ключ пользовательских настроек цветов основанный на переданных значениях
 * @param {Source} source - источник
 * @param {Attribute} attribute - атрибут
 * @param {Group} group - группировка атрибута
 * @returns {string | null}
 */
const createCustomColorsSettingsKey = (source: Source, attribute: Attribute, group: Group): string | null => {
	let key = source && attribute && group ? `${source.value}-${attribute.code}-${group.data}` : null;

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
	const type = getCustomColorsSettingsType(widget);
	const {BREAKDOWN, LABEL} = CUSTOM_CHART_COLORS_SETTINGS_TYPES;
	const {breakdown, parameters, source} = getMainDataSet(widget.data);
	let key = null;

	if (type === BREAKDOWN && Array.isArray(breakdown)) {
		const {attribute, group} = breakdown[0];

		key = createCustomColorsSettingsKey(source.value, attribute, group);
	}

	if (type === LABEL) {
		const {attribute, group} = (parameters && parameters[0]) ?? {};

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
	const {attribute, group} = (breakdown && breakdown[0]) ?? {};

	return createCustomColorsSettingsKey(source.value, attribute, group);
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

export {
	createNewWidget,
	getBuildSet,
	getCustomColorsSettingsType,
	getCustomColorsSettingsKey,
	getComboYAxisName,
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
