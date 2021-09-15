// @flow
import {axisMixin, circleMixin, comboMixin} from './mixins';
import type {Chart, DataLabels, WidgetType} from 'store/widgets/data/types';
import {CHART_TYPES, DATA_LABELS_TEXT_ANCHOR, LOCALES} from './constants';
import type {DataLabelsTextAnchor, Options, Series} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDownBySelection} from './methods';
import {extend} from 'helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import isMobile from 'ismobilejs';
import {setColors} from './helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Функция возвращает примесь опций в зависимости от переданного типа графика
 * @param {Chart} widget - тип графика выбранный пользователем
 * @param {DiagramBuildData} data - тип графика выбранный пользователем
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {Function}
 */
const resolveMixin = (widget: Chart, data: DiagramBuildData, container: HTMLDivElement): Function => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = WIDGET_TYPES;

	switch (widget.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return axisMixin(widget, data, container);
		case COMBO:
			return comboMixin(widget, data, container);
		case DONUT:
		case PIE:
			return circleMixin(widget, data, container);
	}
};

const getDataLabelsOptions = (settings: DataLabels, data: DiagramBuildData) => {
	const {fontColor, fontFamily, fontSize, show, showShadow} = settings;
	const {series} = data;
	const options: Object = {
		background: {
			enabled: false
		},
		dropShadow: {
			enabled: false
		},
		enabled: show,
		style: {
			colors: new Array(series.length).fill(fontColor),
			fontFamily,
			fontSize
		}
	};

	if (!isMobile().apple.device && showShadow) {
		options.dropShadow = {
			blur: 0.5,
			enabled: true,
			left: 1,
			opacity: 0.9,
			top: 1
		};
	}

	return options;
};

/**
 * Определяет выравнивание меток для гистограмм
 * @param {Array<string|number>}  data - данные для определения выравнивания
 * @returns  {DataLabelsTextAnchor} - выравнивание
 */
const getDataLabelsTextAnchor = (data: Array<string | number>): DataLabelsTextAnchor => {
	const normalizedData = data.map(item => typeof item === 'string' ? parseFloat(item) : item);
	const maxDataItem = Math.max(...normalizedData);
	const minDataItem = Math.min(...normalizedData);
	let result = DATA_LABELS_TEXT_ANCHOR.MIDDLE;

	if (maxDataItem * 0.25 > minDataItem) {
		result = DATA_LABELS_TEXT_ANCHOR.START;
	}

	return result;
};

/**
 * Получение стиля меток для гистограмм
 * @param {DataLabels} settings - настройки пользователя
 * @param {DiagramBuildData} data - данные гистограммы
 * @returns {Options} - настройки стиля для меток
 */
const getBarDataLabelsOptions = (settings: DataLabels, data: DiagramBuildData) => {
	const {series} = data;
	const textAnchors = series.map(({data}) => getDataLabelsTextAnchor(data));
	let textAnchor = DATA_LABELS_TEXT_ANCHOR.MIDDLE;

	if (textAnchors.length > 0) {
		const firstTextAnchor = textAnchors[0];

		if (textAnchors.every(anchor => anchor === firstTextAnchor)) {
			textAnchor = firstTextAnchor;
		}
	}

	const options = getDataLabelsOptions(settings, data);

	return {...options, textAnchor};
};

/**
 * Функция преобразует набор данных в требуемый формат
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @returns {Series}
 */
const getSeries = (widget: Chart, data: DiagramBuildData): Series => {
	const {series: originalSeries} = data;
	let series = originalSeries;

	if (widget.type === WIDGET_TYPES.COMBO && originalSeries.length > 0) {
		series = originalSeries.map(s => ({
			...s,
			type: s.type.toUpperCase() === WIDGET_TYPES.LINE ? CHART_TYPES.line : CHART_TYPES.bar
		}));
	}

	return series;
};

/**
 * Функция возвращет объединенный набор базовых и типовых опций
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные настройки цветов
 * @returns {Options}
 */
const getOptions = (
	widget: Chart,
	data: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): Options => {
	const {type: widgetType} = widget;
	const series = getSeries(widget, data);
	const type = widgetType === WIDGET_TYPES.COMBO ? getComboType(series) : getChartType(widgetType);
	const {dataLabels: widgetDataLabels} = widget;
	const dataLabels = widgetType === WIDGET_TYPES.BAR
		? getBarDataLabelsOptions(widgetDataLabels, data)
		: getDataLabelsOptions(widgetDataLabels, data);

	let options: Options = {
		chart: {
			animations: {
				enabled: false
			},
			background: 'white',
			defaultLocale: 'ru',
			events: {
				dataPointSelection: drillDownBySelection(widget, data)
			},
			height: '100%',
			locales: LOCALES,
			parentHeightOffset: 0,
			redrawOnWindowResize: false,
			type,
			width: '100%',
			zoom: {
				enabled: false
			}
		},
		dataLabels,
		series
	};

	options = setColors(options, widget, data, globalColorsSettings);

	return extend(options, resolveMixin(widget, data, container));
};

/**
 * Возвращает общий тип комбо-графика на основе данных для построения
 * @param {Series} series - данные построения осей
 * @returns {string}
 */
const getComboType = (series: Series) => {
	return series.length === 1 ? series[0].type : CHART_TYPES.line;
};

/**
 * Возвращает тип графика на основе типа виджета
 * @param {WidgetType} type - тип виджета
 * @returns {string}
 */
const getChartType = (type: WidgetType) => {
	const {DONUT, LINE, PIE} = WIDGET_TYPES;
	const {bar, donut, line, pie} = CHART_TYPES;

	switch (type) {
		case DONUT:
			return donut;
		case LINE:
			return line;
		case PIE:
			return pie;
		default:
			return bar;
	}
};

export {
	getChartType,
	getOptions
};
