// @flow
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {axisMixin, circleMixin, comboMixin} from './mixins';
import type {Chart, DataLabels, WidgetType} from 'store/widgets/data/types';
import {CHART_TYPES, DATA_LABELS_LIMIT, LOCALES} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDownBySelection} from './methods';
import {extend} from 'src/helpers';
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
			return axisMixin(true)(widget, data, container);
		case BAR_STACKED:
			return axisMixin(true, true)(widget, data, container);
		case COLUMN:
			return axisMixin(false)(widget, data, container);
		case COLUMN_STACKED:
			return axisMixin(false, true)(widget, data, container);
		case COMBO:
			return comboMixin(widget, data, container);
		case DONUT:
		case PIE:
			return circleMixin(widget, data, container);
		case LINE:
			return axisMixin(false)(widget, data, container);
	}
};

const getDataLabelsOptions = (settings: DataLabels, data: DiagramBuildData, isAxisChart: boolean) => {
	const {fontColor, fontFamily, fontSize, show, showShadow} = settings;
	const {series} = data;
	let dataLabelsLimitIsExceeded = false;

	if (isAxisChart) {
		const sumDataValues = series.reduce((sum, s) => sum + s.data.length, 0);
		dataLabelsLimitIsExceeded = sumDataValues > DATA_LABELS_LIMIT;
	}

	const options: Object = {
		background: {
			enabled: false
		},
		dropShadow: {
			enabled: false
		},
		enabled: show && !dataLabelsLimitIsExceeded,
		style: {
			colors: new Array(series.length).fill(fontColor),
			fontFamily,
			fontSize
		}
	};

	if (showShadow) {
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
 * Функция преобразует набор данных в требуемый формат
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Chart, data: DiagramBuildData): ApexAxisChartSeries => {
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
 * @returns {ApexOptions}
 */
const getOptions = (widget: Chart, data: DiagramBuildData, container: HTMLDivElement): ApexOptions => {
	const {colors, type: widgetType} = widget;
	const type = widgetType === WIDGET_TYPES.COMBO ? CHART_TYPES.line : getChartType(widgetType);
	const {bar, line} = CHART_TYPES;
	const {dataLabels} = widget;
	const isAxisChart = type === bar || type === line;

	const options: ApexOptions = {
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
		colors: [...colors],
		dataLabels: getDataLabelsOptions(dataLabels, data, isAxisChart),
		series: getSeries(widget, data)
	};

	return extend(options, resolveMixin(widget, data, container));
};

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
