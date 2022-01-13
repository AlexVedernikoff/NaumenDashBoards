// @flow
import type {AnyWidget, CustomFilter, DisplayMode, Widget} from 'store/widgets/data/types';
import api from 'api';
import {CLEAR_FILTER} from './constants';
import {createFilterContext, getFilterContext} from 'store/helpers';
import {deepClone} from 'helpers';
import {DIAGRAM_WIDGET_TYPES, DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import type {DropDownParams, FiltersOnWidget, NavigationData, NavigationProps, Option} from './types';
import exporter, {FILE_VARIANTS} from 'utils/export';
import {getPartsClassFqn} from 'store/widgets/links/helpers';
import {ICON_NAMES} from 'components/atoms/Icon';
import memoize from 'memoize-one';
import t, {translateObjectsArray} from 'localization';

/**
 * Преобразует AnyWidget в Widget
 * @param {AnyWidget} awidget - виджет
 * @returns {Widget|null} - Widget в случае если тип AnyWidget подходит для Widget, иначе - null
 */
const parseDiagramWidget = (awidget: AnyWidget): ?Widget => {
	let result: ?Widget = null;

	if (awidget.type !== WIDGET_TYPES.TEXT) {
		result = awidget;
	}

	return result;
};

/**
 * Формирует данные для отображения кнопки навигации
 * @param {AnyWidget} awidget - виджет
 * @returns  {NavigationProps}
 */
const navigationSelector = memoize((awidget: AnyWidget): NavigationProps | null => {
	const widget = parseDiagramWidget(awidget);

	if (widget) {
		const {navigation} = widget;

		if (navigation.show) {
			const {showTip, tip} = navigation;
			const text = !showTip ? '' : tip;
			return {text};
		}
	}

	return null;
});

/**
 * Формирует данные для перехода по кнопке навигации
 * @param   {AnyWidget}  awidget  [awidget description]
 * @returns {NavigationData}
 */
const getDataForNavigation = memoize((awidget: AnyWidget): ?NavigationData => {
	const widget = parseDiagramWidget(awidget);

	if (widget) {
		const {navigation} = widget;
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
 * @param {AnyWidget} awidget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const modeSelector = memoize((awidget: AnyWidget): ?DropDownParams => {
	const {displayMode} = awidget;
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
 * @param {AnyWidget} awidget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const exportParamsSelector = memoize((awidget: AnyWidget): ?DropDownParams => {
	const widget = parseDiagramWidget(awidget);

	if (widget) {
		const {PDF, PNG, XLSX} = FILE_VARIANTS;
		const availableOptions = [PDF, PNG];

		if (widget.type === DIAGRAM_WIDGET_TYPES.TABLE) {
			availableOptions.push(XLSX);
		}

		return {
			availableOptions: availableOptions.map(value => ({ label: value.toUpperCase(), value })),
			icon: ICON_NAMES.EXPORT,
			text: t('WidgetKebab::Export'),
			value: null
		};
	}

	return null;
});

/**
 * Формирует спецификацию отображения выпадающего списка перехода на страницу источника
 * @param {AnyWidget} awidget - виджет
 * @returns {DropDownParams} - спецификация отображения выпадающего списка
 */
const dataSelector = memoize((awidget: AnyWidget): ?DropDownParams => {
	const widget = parseDiagramWidget(awidget);

	if (widget) {
		const availableOptions = [];

		widget.data.forEach(({source, sourceForCompute}, value) => {
			if (!sourceForCompute) {
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
 * Проверка того, что на виджете установленна пользовательская фильтрация
 * @param {Widget} widget - виджет
 * @returns {boolean}
 */
const hasUserFilters = (widget: Widget) => widget.data.some(item => item.source.widgetFilterOptions?.some(filter => isNotEmptyDescriptor(filter.descriptor)));

/**
 * Проверка того, что в описании источника установлены фильтры
 * @param {string} descriptor - строка описания источника
 * @returns {boolean}
 */
const isNotEmptyDescriptor = (descriptor: ?string) => {
	if (descriptor) {
		try {
			const {filters} = JSON.parse(descriptor);
			return Array.isArray(filters) && filters.length > 0;
		} catch (e) {
			console.error('Filters on widgets has unparsed descriptor');
			return false;
		}
	}

	return false;
};

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
		const {value: {label: sourceLabel}, widgetFilterOptions} = source;
		const subResult = [];

		if (widgetFilterOptions) {
			widgetFilterOptions.forEach(({descriptor, label}, filterIndex) => {
				const value = `${dataSetIndex}::${filterIndex}`;
				const option = {label, sourceLabel, value};

				subResult.push(option);

				if (isNotEmptyDescriptor(descriptor)) {
					selected = value;
				}
			});
		}

		subResult.forEach(item => result.push(item));
		dataSetWithFiltersCount++;
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
 * @param {CustomFilter} filter - пользовательские фильтр на виджете
 * @param {string} classFqn - класс источника
 * @returns {Promise<string>} - новый дескриптор с установленным фильтром
 */
const getNewDescriptor = async (filter: CustomFilter, classFqn: string): Promise<string> => {
	const {descriptor} = filter;
	let newDescriptor = '';

	try {
		const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

		if (context) {
			context['attrCodes'] = filter.attributes.map(attr => {
				const {code, declaredMetaClass, metaClassFqn} = attr;
				const {classFqn} = getPartsClassFqn(declaredMetaClass ?? metaClassFqn);

				return `${classFqn}@${code}`;
			});

			({serializedContext: newDescriptor} = await api.instance.filterForm.openForm(context, true));
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
		const updateDescriptor = isNotEmptyDescriptor(newDescriptor) ? newDescriptor : '';
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
			widgetFilterOptions.forEach(widgetFilter => { widgetFilter.descriptor = ''; });
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

export {
	changeFiltersOnWidget,
	clearFiltersOnWidget,
	dataSelector,
	exportParamsSelector,
	exportScreenShot,
	filtersOnWidgetSelector,
	getDataForNavigation,
	getNewDescriptor,
	hasUserFilters,
	isNotEmptyDescriptor,
	modeSelector,
	navigationSelector,
	parseDiagramWidget
};
