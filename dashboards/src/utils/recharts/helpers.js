// @flow
import {AXIS_FONT_SIZE} from 'utils/recharts/constants';
import type {
	AxisOptions,
	CalculateCategoryHeightResult,
	CalculateCategoryWidthResult,
	DataLabelsOptions,
	ReChartLegend,
	RechartData,
	RechartDataItem,
	SeriesInfo
} from './types';
import type {
	AxisSettings,
	AxisWidget,
	Chart,
	CircleWidget,
	ComboWidget,
	CustomChartColorsSettings,
	CustomChartColorsSettingsData,
	Legend,
	LegendPosition,
	SpeedometerWidget,
	SummaryWidget,
	Widget
} from 'store/widgets/data/types';
import {
	CHART_COLORS_SETTINGS_TYPES,
	DEFAULT_BREAKDOWN_COLOR,
	DEFAULT_CHART_COLORS,
	DIAGRAM_WIDGET_TYPES
} from 'store/widgets/data/constants';
import {
	DEFAULT_LEGEND,
	LABEL_DRAW_MODE,
	LEGEND_ALIGN,
	LEGEND_DISPLAY_TYPES,
	LEGEND_HEIGHT,
	LEGEND_LAYOUT,
	LEGEND_POSITIONS,
	LEGEND_VERTICAL_ALIGN,
	LEGEND_WIDTH_PERCENT,
	RULER_WIDTH
} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {hasBreakdown} from 'store/widgets/helpers';
import {SEPARATOR} from 'store/widgets/buildData/constants';

/**
 * Округляет число до ближайшего минимального круглого числа, большего чем value
 * @param {number} value - исходное число
 * @returns {number} - округленное число
 */
const getNiceScale = (value: number) => {
	const exponent = Math.round(Math.log10(value) - 1);
	const converter = Math.pow(10, exponent);

	return Math.ceil(value / converter) * converter;
};

/**
 * Формирует геттер для последовательного получения цветов из массива colors
 * @param {Array<string>} colors - массив цветов
 * @returns {Function} - геттер
 */
const getAutoColor = (colors: Array<string>) =>
	(label: string, i: number) => colors[i % colors.length] || DEFAULT_CHART_COLORS[0];

/**
 * Формирует геттер для  получения цветов из пользовательских настроек
 * @param {CustomChartColorsSettings} customSettings - настройки на виджете
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные настройки
 * @returns {Function} - геттер
 */
const getColorForLabel = (
	customSettings: CustomChartColorsSettings,
	globalColorsSettings: GlobalCustomChartColorsSettings
) => {
	let {data: customSettingsData, useGlobal} = customSettings;

	if (useGlobal && globalColorsSettings) {
		customSettingsData = globalColorsSettings;
	}

	if (customSettingsData) {
		return (label: string, i: number) => {
			const color = customSettingsData?.colors.find(item => equalLabels(item.key, label));
			return color?.color ?? customSettingsData?.defaultColor ?? DEFAULT_BREAKDOWN_COLOR;
		};
	}

	return getAutoColor(DEFAULT_CHART_COLORS);
};

/**
 * Возвращает список цветов для значений разбивки
 * @param {CustomChartColorsSettingsData} settings - настройки цветов
 * @param {Array<string>} labels - лейблы, относительно которых происходит настройка
 * @param {Array<string>} defaultColors - набор цветов по умолчанию
 * @returns {boolean}
 */
const getBreakdownColors = (settings: CustomChartColorsSettingsData, labels: Array<string>, defaultColors: Array<string> = []) => {
	const colors = Array(labels.length).fill(settings.defaultColor).map((c, i) => defaultColors[i] ?? c);
	const usedLabels = [];

	settings.colors.forEach(({color, key}) => {
		const index = labels.findIndex((label, index) => equalLabels(label, key) && !usedLabels.includes(index));

		if (index > -1) {
			if (color) {
				colors[index] = color;
			}

			usedLabels.push(index);
		}
	});

	return colors;
};

/**
 * Сравнивает значения подписей
 * @param {string} label1 - значение лейбла
 * @param {string} label2 - значение лейбла
 * @returns {boolean}
 */
const equalLabels = (label1: string, label2: string) => {
	let result = label1 === label2;

	if (label1?.includes(SEPARATOR) && label2?.includes(SEPARATOR)) {
		result = label1.split(SEPARATOR)[1] === label2.split(SEPARATOR)[1];
	} else if (label1?.includes(SEPARATOR)) {
		result = label1.split(SEPARATOR)[0] === label2;
	} else if (label2?.includes(SEPARATOR)) {
		result = label2.split(SEPARATOR)[0] === label1;
	}

	return result;
};

/**
 * Формирует данные для осевых графиков rechart
 * @param {DiagramBuildData} data  - данные от сервера
 * @returns {RechartData} - данные для rechart
 */
const getSeriesData = (data: DiagramBuildData): RechartData => {
	const result = [];
	const {labels, series} = data;

	labels.forEach((label, i) => {
		const item: RechartDataItem = {name: label};

		series.forEach(({data, dataKey, name}) => {
			const id = dataKey ?? name ?? 'value';

			item[id] = +data[i];
		});

		result.push(item);
	});

	return result;
};

/**
 * Формирует данные для комбо графиков rechart
 * @param {DiagramBuildData} data  - данные от сервера
 * @returns {RechartData} - данные для rechart
 */
const getComboSeriesData = (data: DiagramBuildData): RechartData => {
	const result = [];
	const {labels, series} = data;

	labels.forEach((label, i) => {
		const item: RechartDataItem = {name: label};

		series.forEach(({data, dataKey, name}) => {
			const id = `${dataKey} ${name}`;

			item[id] = +data[i];
		});

		result.push(item);
	});

	return result;
};

/**
 * Формирует данные для круговых графиков rechart
 * @param {CircleWidget} widget - виджет
 * @param {DiagramBuildData} data - данные от сервера
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные цвета
 * @returns {RechartData} - данные для rechart
 */
const getCircleSeriesData = (
	widget: CircleWidget,
	data: DiagramBuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings
): RechartData => {
	const {labels, series} = data;

	const getColor = widget.colorsSettings.type === CHART_COLORS_SETTINGS_TYPES.AUTO
		? getAutoColor(widget.colorsSettings.auto.colors)
		: getColorForLabel(widget.colorsSettings.custom, globalColorsSettings);

	const result = labels.map((label, i) => ({
		color: getColor(label, i),
		name: label,
		value: series[i]
	}));

	return result;
};

const getAxisWidget = (widget: Widget): ?AxisWidget => {
	let result: ?AxisWidget = null;
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE} = DIAGRAM_WIDGET_TYPES;

	if (
		widget.type === BAR
		|| widget.type === BAR_STACKED
		|| widget.type === COLUMN
		|| widget.type === COLUMN_STACKED
		|| widget.type === LINE
	) {
		result = widget;
	}

	return result;
};

const getCircleWidget = (widget: Widget): ?CircleWidget => {
	let result: ?CircleWidget = null;
	const {DONUT, PIE} = DIAGRAM_WIDGET_TYPES;

	if (widget.type === PIE || widget.type === DONUT) {
		result = widget;
	}

	return result;
};

const getComboWidget = (widget: Widget): ?ComboWidget => {
	let result: ?ComboWidget = null;

	if (widget.type === DIAGRAM_WIDGET_TYPES.COMBO) {
		result = widget;
	}

	return result;
};

const getSpeedometerWidget = (widget: Widget): ?SpeedometerWidget => {
	let result: ?SpeedometerWidget = null;
	const {SPEEDOMETER} = DIAGRAM_WIDGET_TYPES;

	if (widget.type === SPEEDOMETER) {
		result = widget;
	}

	return result;
};

const getSummaryWidget = (widget: Widget): ?SummaryWidget => {
	let result: ?SummaryWidget = null;
	const {SUMMARY} = DIAGRAM_WIDGET_TYPES;

	if (widget.type === SUMMARY) {
		result = widget;
	}

	return result;
};

const transformLegendPosition = (
	legendAlign: LegendPosition
): [$Values<typeof LEGEND_ALIGN>, $Values<typeof LEGEND_VERTICAL_ALIGN>] => {
	let result = [LEGEND_ALIGN.CENTER, LEGEND_VERTICAL_ALIGN.MIDDLE];

	if (legendAlign === LEGEND_POSITIONS.right) {
		result = [LEGEND_ALIGN.RIGHT, LEGEND_VERTICAL_ALIGN.TOP];
	} else if (legendAlign === LEGEND_POSITIONS.left) {
		result = [LEGEND_ALIGN.LEFT, LEGEND_VERTICAL_ALIGN.TOP];
	} else if (legendAlign === LEGEND_POSITIONS.top) {
		result = [LEGEND_ALIGN.CENTER, LEGEND_VERTICAL_ALIGN.TOP];
	} else if (legendAlign === LEGEND_POSITIONS.bottom) {
		result = [LEGEND_ALIGN.CENTER, LEGEND_VERTICAL_ALIGN.BOTTOM];
	}

	return result;
};

/**
 * Трансформирует легенду для ReChart
 * @param {HTMLDivElement} container - общий контейнер
 * @param {Legend} legend - легенда
 * @returns {ReChartLegend} - ReChart легенда
 */
const getLegendOptions = (container: HTMLDivElement, legend: ?Legend): ReChartLegend => {
	if (legend) {
		const {displayType, fontFamily, fontSize, position, show, textHandler} = legend;
		const [align, verticalAlign] = transformLegendPosition(position);
		const {height: containerHeight, width: containerWidth} = container.getBoundingClientRect();
		let layout = LEGEND_LAYOUT.VERTICAL;
		let height = null;
		let width = null;
		const style = {fontFamily, fontSize, maxWidth: undefined};

		if (align === LEGEND_ALIGN.CENTER) {
			layout = displayType === LEGEND_DISPLAY_TYPES.BLOCK ? LEGEND_LAYOUT.VERTICAL : LEGEND_LAYOUT.HORIZONTAL;
			height = LEGEND_HEIGHT;
			width = containerWidth;
		} else {
			height = containerHeight;
			width = containerWidth * LEGEND_WIDTH_PERCENT;
		}

		return {
			align,
			height,
			layout,
			show,
			style,
			textHandler,
			verticalAlign,
			width
		};
	}

	return DEFAULT_LEGEND;
};

const getRechartAxisSetting = (axis: AxisSettings): $Shape<AxisOptions> => {
	const {show, showName, fontFamily, fontSize = AXIS_FONT_SIZE} = axis;
	return {fontFamily, fontSize, show, showName};
};

/**
 * Расчет размеров текста
 * @param {Array<string>} values - метки (могут быть многострочными)
 * @param {string} fontFamily - шрифт отрисовки
 * @param {number} fontSize - размер шрифта отрисовки
 * @param {number} rotate - угол поворота надписи
 * @returns {Array} - размеры меток
 */
const calculateStringsSize = (
	values: Array<string[]>,
	fontFamily: string,
	fontSize: number,
	rotate: number = 0
): Array<{height: number, width: number}> => {
	const NS = 'http://www.w3.org/2000/svg';
	const body = document.body;
	const result = [];

	if (body != null) {
		const svg = document.createElementNS(NS, 'svg');

		body.appendChild(svg);

		const elements = [];

		// 1. вначале добавляем все строки в одну svg
		values.forEach(value => {
			const text = document.createElementNS(NS, 'text');

			text.setAttribute('font-family', fontFamily);
			text.setAttribute('font-size', `${fontSize}px`);
			svg.appendChild(text);

			value.forEach((entry, i) => {
				const tspan = document.createElementNS(NS, 'tspan');
				const textNode = document.createTextNode(entry);

				tspan.setAttribute('x', '0px');
				tspan.setAttribute('dy', `${i}em`);
				tspan.appendChild(textNode);
				text.appendChild(tspan);
			});

			elements.push(text);
		});

		// 1.1 нельзя повернуть текст так чтобы getBBox правильно считала значения
		// высоты и ширины отображаемого блока. Всегда будут размеры без трансформаций
		// а getClientRect не будет работать, если виджет не в области отображения
		// поэтому считаем через косинусы
		let heightMul = (height, width) => height;
		let widthMul = (height, width) => width;

		if (rotate) {
			const angle = Math.abs(Math.PI * rotate / 180);
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			heightMul = (height, width) => height * cos + width * sin;
			widthMul = (height, width) => height * sin + width * cos;
		}

		// 2. потом подсчитываем ширину и высоту каждого блока
		// getBBox вызывает ререндер элемента DOM, поэтому переносим
		// его после создания svg
		elements.forEach(text => {
			// $FlowFixMe:prop-missing
			const {height, width} = text.getBBox();

			result.push({
				height: heightMul(height, width),
				width: widthMul(height, width)
			});
		});

		body.removeChild(svg);
	}

	return result;
};

/**
 * Проверяет на то, что все может разместиться в одной строке по оси Y
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} maxWidth - максимальная ширина для подписей
 * @returns {number | null} - минимальная ширина для меток, в случае успеха, null в противном случае
 */
const checkOneLineWidth = (labels: Array<string>, params: AxisOptions, maxWidth: number): number | null => {
	let result = null;
	const lineSizes = calculateStringsSize(labels.map(label => [label]), params.fontFamily, params.fontSize);
	const widths = lineSizes.map(({width}) => width);
	const maxOfWidths = Math.max(...widths);

	if (maxOfWidths < maxWidth) {
		result = Math.ceil(maxOfWidths);
	}

	return result;
};

/**
 * Проверяет, могут ли метки разместиться в несколько строках по оси Y
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} maxWidth - максимальная ширина для подписей
 * @param {number} height - высота оси
 * @returns {number | null} - минимальная ширина для меток, в случае успеха, null в противном случае
 */
const checkMultilineWidth = (labels: Array<string>, params: AxisOptions, maxWidth: number, height: number): number | null => {
	let result = null;
	// Проверка на то что все может разместиться в разбитых строках:  mode - line
	const multilineSizes = calculateStringsSize(labels.map(label => label.split(' ')), params.fontFamily, params.fontSize);
	const widths = multilineSizes.map(({width}) => width);
	const maxOfWidths = Math.max(...widths);
	const heights = multilineSizes.map(({height}) => height);
	const heightsBetweenTicks = (labels.length - 1) * params.fontSize * 0.5;
	const lineHeight = labels.length > 0 ? (height - heightsBetweenTicks) / labels.length : height;
	const checkHeight = heights.every(h => h < lineHeight);

	if (maxOfWidths < maxWidth && checkHeight) {
		result = Math.ceil(maxOfWidths);
	}

	return result;
};

/**
 * Расчет ширины и метода размещения меток категорий на оси Y
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} maxWidth - максимальная ширина для подписей
 * @param {number} height - высота оси
 * @returns {CalculateCategoryWidthResult} - ширина и метод размещения меток
 */
const calculateCategoryWidth = (
	labels: Array<string>,
	params: AxisOptions,
	maxWidth: number,
	height: number
): CalculateCategoryWidthResult => {
	let result = {mode: LABEL_DRAW_MODE.TRIM, width: maxWidth};
	const singleLine = checkOneLineWidth(labels, params, maxWidth);

	if (singleLine) {
		result = {mode: LABEL_DRAW_MODE.SINGLELINE, width: singleLine};
	} else {
		const multiline = checkMultilineWidth(labels, params, maxWidth, height);

		if (multiline) {
			result = {mode: LABEL_DRAW_MODE.MULTILINE, width: multiline};
		}
	}

	return result;
};

/**
 * Проверяет на то, что метки могут разместиться в одну сроку по оси X
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} axisWidth - ширина оси
 * @returns {number | null} - высота для меток, в случае успеха, null в противном случае
 */
const checkOneLineHeight = (
	labels: Array<string>,
	params: AxisOptions,
	axisWidth: number
) => {
	let result = null;
	const rowWidth = axisWidth / labels.length;
	const linesSizes = calculateStringsSize(labels.map(label => [label]), params.fontFamily, params.fontSize);
	const widths = linesSizes.map(({width}) => width);
	const maxOfWidths = Math.max(...widths);

	if (maxOfWidths < rowWidth) {
		const heights = linesSizes.map(({height}) => height);

		result = Math.max(...heights) * 1.25;
	}

	return result;
};

/**
 * Проверяет, могут ли метки разместиться в несколько строках по оси X по ширине
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} axisWidth - ширина оси
 * @param {number} axisMaxHeight - максимальная высота для подписей
 * @returns {number | null} - минимальная ширина для меток, в случае успеха, null в противном случае
 */
const checkMultilineHeight = (
	labels: Array<string>,
	params: AxisOptions,
	axisWidth: number,
	axisMaxHeight: number
): number | null => {
	let result = null;
	const columnWidth = axisWidth / labels.length;
	const multiLines = labels.map(label => label.split(' '));
	const multilineSizes = calculateStringsSize(multiLines, params.fontFamily, params.fontSize);
	const isLessWidth = multilineSizes.every(({width}) => width < columnWidth);
	const heights = multilineSizes.map(({height}) => height);
	const maxHeightLabels = Math.max(...heights);

	if (isLessWidth && maxHeightLabels < axisMaxHeight) {
		result = maxHeightLabels;
	}

	return result;
};

/**
 * Проверяет максимальную высоту развернутых меток
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @returns {number | null} - высота для меток, в случае успеха, null в противном случае
 */
const checkRotateHeight = (
	labels: Array<string>,
	params: AxisOptions
) => {
	const rotateSizes = calculateStringsSize(labels.map(label => [label]), params.fontFamily, params.fontSize, -60);
	const heights = rotateSizes.map(({height}) => height);

	return Math.ceil(Math.max(...heights));
};

/**
 * Расчет высоты и метода размещения меток категорий на оси X
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} maxHeight - максимальная ширина для подписей
 * @param {number} width - высота оси
 * @returns {CalculateCategoryHeightResult} - высота и метод размещения меток
 */
const calculateCategoryHeight = (
	labels: Array<string>,
	params: AxisOptions,
	maxHeight: number,
	width: number
): CalculateCategoryHeightResult => {
	let result = {height: maxHeight, mode: LABEL_DRAW_MODE.ROTATE};
	const singleLine = checkOneLineHeight(labels, params, width);

	if (singleLine) {
		result = {height: singleLine, mode: LABEL_DRAW_MODE.SINGLELINE};
	} else {
		const multiline = checkMultilineHeight(labels, params, width, maxHeight);

		if (multiline) {
			result = {height: multiline, mode: LABEL_DRAW_MODE.MULTILINE};
		} else {
			const AXIS_HEIGHT = 8;
			const rotateHeight = checkRotateHeight(labels, params) + AXIS_HEIGHT;

			if (rotateHeight < maxHeight) {
				result = {height: rotateHeight, mode: LABEL_DRAW_MODE.ROTATE};
			}
		}
	}

	return result;
};

/**
 * Формирует информацию о рядах данных для осевых диаграмм
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные настройки цветов
 * @returns {SeriesInfo} - ряды данных осевой диаграммы
 */
const getSeriesInfo = (
	widget: Chart,
	data: DiagramBuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings
): SeriesInfo => {
	const {series} = data;
	const breakdown = hasBreakdown(widget);

	const getColor = widget.colorsSettings.type === CHART_COLORS_SETTINGS_TYPES.AUTO
		? getAutoColor(widget.colorsSettings.auto.colors)
		: getColorForLabel(widget.colorsSettings.custom, globalColorsSettings);

	const result = series.map(({dataKey = null, name, type = null}, i) => ({
		breakdownLabels: breakdown ? null : data.labels,
		color: (label: string) => getColor(label, i),
		key: dataKey ?? name,
		label: name,
		type
	}));

	return result;
};

/**
 * Формирует настройки для меток данных
 * @param {AxisWidget} widget - виджет
 * @returns {DataLabelsOptions} - настройки для меток данных
 */
const getDataLabels = (widget: AxisWidget | CircleWidget | ComboWidget): DataLabelsOptions => {
	const {disabled, fontColor, fontFamily, fontSize, show, showShadow} = widget.dataLabels;
	return {fontColor, fontFamily, fontSize, show: show && !disabled, showShadow};
};

/**
 * Возвращает отложенный расчет общего количества данных на диаграмме
 * @param {DiagramBuildData} data - данные конкретного графика
 * @returns {() => number}
 */
const getTotalCalculator = (data: DiagramBuildData) => (targetDataKey?: ?string = null) => {
	let result = 0;

	data.series.forEach(({data: row, dataKey}) => {
		if (targetDataKey === null || dataKey === targetDataKey) {
			row.forEach(item => {
				if (typeof item === 'number') {
					result += item;
				} else if (typeof item === 'string') {
					const itemValue = Number.parseInt(item);

					if (!isNaN(itemValue)) {
						result += itemValue;
					}
				}
			});
		}
	});

	return result;
};

/**
 * Расчет ширины Y оси с индикатором
 * TODO: такое же есть в колоночных
 * @param {string} maxString - максимально значение на оси
 * @param {AxisOptions} settings - параметры оси
 * @param {string} axisName - название оси
 * @returns {number} - ширина оси
 */
const calculateYAxisNumberWidth = (maxString: string, settings: AxisOptions, axisName: string) => {
	const sizes = calculateStringsSize([[maxString], [axisName]], settings.fontFamily, settings.fontSize);
	let result = (sizes[0]?.width ?? 0) + RULER_WIDTH;

	if (settings.showName) {
		const labelHeight = (sizes[1]?.height ?? 0);

		result += labelHeight + 3;
	}

	return result;
};

export {
	calculateCategoryHeight,
	calculateCategoryWidth,
	calculateStringsSize,
	calculateYAxisNumberWidth,
	equalLabels,
	getAutoColor,
	getAxisWidget,
	getBreakdownColors,
	getCircleSeriesData,
	getCircleWidget,
	getColorForLabel,
	getComboSeriesData,
	getComboWidget,
	getDataLabels,
	getLegendOptions,
	getNiceScale,
	getRechartAxisSetting,
	getSeriesData,
	getSeriesInfo,
	getSpeedometerWidget,
	getSummaryWidget,
	getTotalCalculator
};
