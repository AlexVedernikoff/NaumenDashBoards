// @flow
import type {
	AnyWidget,
	AxisData,
	CircleData,
	ComboData,
	CustomFilter,
	DisplayMode,
	PivotData,
	TableData,
	Widget
} from 'store/widgets/data/types';
import api from 'api';
import {CLEAR_FILTER} from './constants';
import {
	createFilterContext,
	descriptorContainsFilter,
	getFilterContext
} from 'utils/descriptorUtils';
import {deepClone} from 'helpers';
import {DIAGRAM_WIDGET_TYPES, DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import type {DrillDownMixin} from 'store/widgets/links/types';
import type {
	DropDownParams,
	FiltersOnWidget,
	NavigationData,
	NavigationProps,
	Option
} from './types';
import exporter, {FILE_VARIANTS} from 'utils/export';
import {getDescriptorCases} from 'src/store/helpers';
import {getPartsClassFqn} from 'store/widgets/links/helpers';
import {ICON_NAMES} from 'components/atoms/Icon';
import memoize from 'memoize-one';
import t, {translateObjectsArray} from 'localization';

/**
 * Преобразует AnyWidget в Widget
 * @param {AnyWidget} widget - виджет
 * @returns {Widget|null} - Widget в случае если тип AnyWidget подходит для Widget, иначе - null
 */
const parseDiagramWidget = (widget: AnyWidget): ?Widget => {
	let result: ?Widget = null;

	if (widget.type !== WIDGET_TYPES.TEXT) {
		result = widget;
	}

	return result;
};

/**
 * Формирует данные для отображения кнопки навигации
 * @param {AnyWidget} widget - виджет
 * @returns  {NavigationProps}
 */
const navigationSelector = memoize((widget: AnyWidget): NavigationProps | null => {
	const diagramWidget = parseDiagramWidget(widget);

	if (diagramWidget) {
		const {navigation} = diagramWidget;

		if (navigation.show) {
			const {showTip, tip} = navigation;
			const text = showTip ? tip : '';
			return {text};
		}
	}

	return null;
});

/**
 * Формирует данные для перехода по кнопке навигации
 * @param   {AnyWidget}  widget - виджет
 * @returns {NavigationData}
 */
const getDataForNavigation = memoize((widget: AnyWidget): ?NavigationData => {
	const diagramWidget = parseDiagramWidget(widget);

	if (diagramWidget) {
		const {navigation} = diagramWidget;
		const {dashboard, widget: navigationWidget} = navigation;

		if (dashboard) {
			const id = navigationWidget ? navigationWidget.value : '';

			return {dashboard: dashboard.value, id};
		}
	}

	return null;
});

/**
 * Преобразует значение DISPLAY_MODE в код иконок
 * @param {DisplayMode} displayMode - режим отображения виджета
 * @returns {string} - код иконки
 */
const getDisplayModeIcon = (displayMode: DisplayMode) => {
	switch (displayMode) {
		case DISPLAY_MODE.WEB:
			return ICON_NAMES.WEB;
		case DISPLAY_MODE.MOBILE:
			return ICON_NAMES.MOBILE;
		default:
			return ICON_NAMES.WEB_MK;
	}
};

/**
 * Формирует спецификацию отображения выпадающего списка выбора режима отображения
 * @param {AnyWidget} widget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const modeSelector = memoize((widget: AnyWidget): ?DropDownParams => {
	const {displayMode} = widget;
	const availableOptions = translateObjectsArray('label', DISPLAY_MODE_OPTIONS);
	const value = availableOptions.find(item => item.value === displayMode) || availableOptions[0];
	return {
		availableOptions,
		icon: getDisplayModeIcon(displayMode),
		text: t('WidgetKebab::Mode', {mode: value.label}),
		value: displayMode
	};
});

/**
 * Формирует спецификацию отображения выпадающего списка экспорта виджета
 * @param {AnyWidget} widget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const exportParamsSelector = memoize((widget: AnyWidget): ?DropDownParams => {
	const diagramWidget = parseDiagramWidget(widget);

	if (diagramWidget) {
		const {PDF, PNG, XLSX} = FILE_VARIANTS;
		const {PIVOT_TABLE, TABLE} = DIAGRAM_WIDGET_TYPES;
		const {type} = diagramWidget;
		const availableOptions = type === PIVOT_TABLE ? [PNG] : [PDF, PNG];

		if (type === TABLE || type === PIVOT_TABLE) {
			availableOptions.push(XLSX);
		}

		return {
			availableOptions: availableOptions.map(value => ({label: value.toUpperCase(), value})),
			icon: ICON_NAMES.EXPORT,
			text: t('WidgetKebab::Export'),
			value: null
		};
	}

	return null;
});

/**
 * Формирует спецификацию отображения выпадающего списка перехода на страницу источника
 * @param {AnyWidget} widget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const dataSelector = memoize((widget: AnyWidget): ?DropDownParams => {
	const diagramWidget = parseDiagramWidget(widget);

	if (diagramWidget) {
		const availableOptions = [];

		diagramWidget.data.forEach(({source, sourceForCompute}, value) => {
			if (!sourceForCompute && source.value) {
				availableOptions.push({
					label: source.value.label,
					value
				});
			}
		});

		return {
			availableOptions,
			icon: ICON_NAMES.DATA,
			text: t('WidgetKebab::Data'),
			value: null
		};
	}

	return null;
});

/**
 * Формирует список пользовательских фильтров на виджете
 * @param {Widget} widget - виджет
 * @returns {FiltersOnWidget} - options - элементы для выпадающего списка; selected - выбранный элемент
 */
const getFiltersOnWidget = (widget: Widget): FiltersOnWidget => {
	const result: Array<Option & {sourceLabel: string}> = [];
	let selected = null;
	let dataSetWithFiltersCount = 0;

	widget.data.forEach(({source}, dataSetIndex) => {
		const {value, widgetFilterOptions} = source;

		if (value) {
			const {label: sourceLabel} = value;
			const subResult = [];

			if (widgetFilterOptions) {
				widgetFilterOptions.forEach(({descriptor, label}, filterIndex) => {
					const value = `${dataSetIndex}::${filterIndex}`;
					const option = {label, sourceLabel, value};

					subResult.push(option);

					if (descriptor) {
						selected = value;
					}
				});
			}

			subResult.forEach(item => result.push(item));
			dataSetWithFiltersCount++;
		}
	});

	if (dataSetWithFiltersCount > 1) {
		result.forEach(option => { option.label = `${option.label} (${option.sourceLabel})`; });
	}

	return {
		options: result.map(({label, value}) => ({label, value})),
		selected
	};
};

/**
 * Формирует спецификацию отображения выпадающего списка пользовательских фильтров на виджете
 * @param {AnyWidget} awidget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const filtersOnWidgetSelector = memoize((awidget: AnyWidget): ?DropDownParams => {
	const widget = parseDiagramWidget(awidget);

	if (widget) {
		const {options: availableOptions, selected: value} = getFiltersOnWidget(widget);

		if (value) {
			availableOptions.push({label: t('WidgetKebab::ClearFilter'), value: CLEAR_FILTER});
		}

		if (availableOptions.length > 0) {
			return {
				availableOptions,
				icon: value ? ICON_NAMES.FILLED_FILTER : ICON_NAMES.FILTER,
				text: t('WidgetKebab::FiltersOnWidget'),
				value
			};
		}
	}

	return null;
});

/**
 * Асинхронное открытие окна платформы для установки фильтрации на виджете
 * @param {CustomFilter} filter - пользовательский фильтр на виджете
 * @param {string} classFqn - класс источника
 * @returns {Promise<string>} - новый дескриптор с установленным фильтром
 */
const getNewDescriptor = async (filter: CustomFilter, classFqn: string): Promise<string> => {
	const {descriptor} = filter;
	let newDescriptor = '';

	try {
		const context = descriptor
			? await getFilterContext(descriptor, classFqn, getDescriptorCases)
			: await createFilterContext(classFqn, getDescriptorCases);

		if (context) {
			context['attrCodes'] = filter.attributes.map(attr => {
				const {code, declaredMetaClass, metaClassFqn} = attr;
				const {classFqn} = getPartsClassFqn(declaredMetaClass ?? metaClassFqn);

				return `${classFqn}@${code}`;
			});

			const options = {useRestriction: true};
			const {serializedContext} = await api.instance.filterForm.openForm(context, options);

			newDescriptor = serializedContext;
		}
	} catch (ex) {
		console.error('Filtration error', ex);
	}

	return newDescriptor;
};

/**
 * Запрашивает у пользователя новый фильтр по пользовательскому фильтру
 * @param {Widget} widget - виджет
 * @param {string} value - порядковый номер источника и пользовательского фильтра, разделенные знаком '::'
 * @returns {Widget | null} - новый объект виджета, если фильтр был установлен
 */
const changeFiltersOnWidget = async (widget: Widget, value: string) => {
	const [dataSetIndex, filterIndex] = value.split('::').map(val => Number.parseInt(val));
	const {source} = widget.data[dataSetIndex];
	const filter = source.widgetFilterOptions?.[filterIndex];

	if (filter) {
		const newDescriptor = await getNewDescriptor(filter, source.value.value);
		const updateDescriptor = await descriptorContainsFilter(newDescriptor) ? newDescriptor : null;
		const newWidget = deepClone(widget);
		const widgetFilter = newWidget.data[dataSetIndex]?.source.widgetFilterOptions?.[filterIndex];

		if (widgetFilter) {
			widgetFilter.descriptor = updateDescriptor;
		}

		return newWidget;
	}

	return null;
};

/**
 * Очищает установленные фильтры в пользовательских фильтрах на виджете
 * @param {Widget} widget - виджет
 * @returns {Widget} - новый объект виджета
 */
const clearFiltersOnWidget = (widget: Widget) => {
	const newWidget = (deepClone(widget): Widget);

	newWidget.data.forEach(dataSet => {
		const {widgetFilterOptions} = dataSet.source;

		if (widgetFilterOptions) {
			widgetFilterOptions.forEach(widgetFilter => { widgetFilter.descriptor = null; });
		}
	});

	return newWidget;
};

/**
 * Экспортирует виджет через скриншот
 * @param {Widget} widget - виджет
 * @param {string} type - тип экспорта
 */
const exportScreenShot = async (widget: Widget, type: $Keys<typeof FILE_VARIANTS>) => {
	if (type === FILE_VARIANTS.PNG) {
		await exporter.exportWidgetAsPNG(widget, true);
	} else if (type === FILE_VARIANTS.PDF) {
		await exporter.exportWidgetAsPDF(widget, true);
	}
};

/**
 * Формирует примесь данных к параметрам создания ссылки для перехода на данные источника
 * @param {Widget} widget - виджет
 * @param {number} index - номер источника
 * @returns {DrillDownMixin} - примесь данных
 */
const getParametersMixin = (widget: Widget, index: number): DrillDownMixin => {
	const title = widget.data[index].source.value.label;
	const result: DrillDownMixin = {
		filters: [],
		title
	};

	if (widget.type === WIDGET_TYPES.BAR
		|| widget.type === WIDGET_TYPES.BAR_STACKED
		|| widget.type === WIDGET_TYPES.COLUMN
		|| widget.type === WIDGET_TYPES.COLUMN_STACKED
		|| widget.type === WIDGET_TYPES.LINE
		|| widget.type === WIDGET_TYPES.COMBO
	) {
		const dataSet: AxisData | ComboData = widget.data[index];

		result.parameters = dataSet.parameters;
		result.showBlankData = dataSet.showBlankData || dataSet.showEmptyData;
	} else if (widget.type === WIDGET_TYPES.DONUT || widget.type === WIDGET_TYPES.PIE) {
		const dataSet: CircleData = widget.data[index];

		result.parameters = [];
		result.showBlankData = dataSet.showBlankData || dataSet.showEmptyData;
	} else if (widget.type === WIDGET_TYPES.TABLE) {
		const dataSet: TableData = widget.data[index];

		result.parameters = dataSet.parameters;
		result.showBlankData = widget.showBlankData || widget.showEmptyData;
	} else if (widget.type === WIDGET_TYPES.PIVOT_TABLE) {
		const dataSet: PivotData = widget.data[index];

		result.parameters = dataSet.parameters;
		result.showBlankData = false;
	}

	return result;
};

export {
	changeFiltersOnWidget,
	clearFiltersOnWidget,
	dataSelector,
	exportParamsSelector,
	exportScreenShot,
	getParametersMixin,
	filtersOnWidgetSelector,
	getDataForNavigation,
	getNewDescriptor,
	modeSelector,
	navigationSelector,
	parseDiagramWidget
};
