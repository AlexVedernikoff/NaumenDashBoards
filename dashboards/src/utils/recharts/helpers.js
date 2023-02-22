// @flow
import {AXIS_FONT_SIZE} from 'utils/recharts/constants';
import type {
	AxisOptions,
	CalculateCategoryHeightResult,
	CalculateCategoryRotateHeight,
	CalculateCategoryWidthResult,
	ContainerSize,
	DataLabelsOptions,
	MultilineHeightResult,
	ReChartLegend,
	RechartCircleData,
	RechartData,
	RechartDataItem,
	RechartSeriesData,
	SeriesInfo,
	SubTotalGetter,
	ValueFromSeriesLabelResult
} from './types';
import type {
	AxisSettings,
	AxisWidget,
	Chart,
	CircleWidget,
	ComboWidget,
	CustomChartColorsSettings,
	CustomChartColorsSettingsData,
	DTIntervalAxisFormat,
	Legend,
	LegendPosition,
	PivotWidget,
	SpeedometerWidget,
	SummaryWidget,
	Widget
} from 'store/widgets/data/types';
import {
	CHART_COLORS_SETTINGS_TYPES,
	DEFAULT_BREAKDOWN_COLOR,
	DEFAULT_CHART_COLORS,
	DIAGRAM_WIDGET_TYPES,
	DT_INTERVAL_PERIOD,
	WIDGET_TYPES
} from 'store/widgets/data/constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {
	DEFAULT_LEGEND,
	DEFAULT_WIDGET_WIDTH,
	LABEL_DRAW_MODE,
	LEGEND_ALIGN,
	LEGEND_DISPLAY_TYPES,
	LEGEND_HEIGHT,
	LEGEND_LAYOUT,
	LEGEND_POSITIONS,
	LEGEND_VERTICAL_ALIGN,
	LEGEND_WIDTH_PERCENT,
	ROTATE_AXIS_COEFFICIENT,
	RULER_WIDTH,
	SUB_TOTAL_POSITION,
	X_AXIS_HEIGHT
} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {hasBreakdown} from 'store/widgets/helpers';
import {INTERVALS_DIVIDER} from 'utils/recharts/formater/constants';
import {SEPARATOR} from 'store/widgets/buildData/constants';

/**
 * Округляет число до ближайшего минимального круглого числа, большего чем value
 * @param {number} value - исходное число
 * @param {boolean} additiveLow - флаг, определяющий, дополнять ли до 5 значения меньше 100
 * @returns {number} - округленное число
 */
const getNiceScale = (value: number, additiveLow: boolean = false): number => {
	let result = value;

	if (additiveLow && value < 100) {
		const remainder = value % 5;
		const additive = 5 - remainder;

		result = value + additive;
	} else if (value !== 0) {
		const exponent = Math.round(Math.log10(value) - 1);
		const converter = Math.pow(10, exponent);

		result = Math.ceil(value / converter) * converter;
	}

	return result;
};

/**
 * Округляет временные интервалы до ближайшего минимального целого интервала
 * @param {number} value - исходное число интервала в ms
 * @param {boolean} format - формат отображения интервала
 * @returns {number} - округленное число в ms
 */
const getNiceScaleDTInterval = (value: number, format: DTIntervalAxisFormat): number => {
	const {quotient} = format;
	const divider = INTERVALS_DIVIDER[quotient || DT_INTERVAL_PERIOD.HOURS];
	const quotientTop = Math.ceil(value / divider);

	return quotientTop * divider;
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
 * Нормализует значение, полученное с сервера, получая значение и процент (если указан)
 * @param {string | number} value - значение, полученное с сервера
 * @returns {ValueFromSeriesLabelResult} - значение, разделенное на само значение и процент
 *  от общего количества, если указано1
 */
const getValueFromSeriesLabel = (value?: string | number): ValueFromSeriesLabelResult => {
	let result: ValueFromSeriesLabelResult = {
		percent: null,
		value: null
	};

	if (typeof value === 'string') {
		if (value.indexOf(' ')) {
			const [valueStr, percentStr] = value.split(' ');

			result = {
				percent: parseFloat(percentStr),
				value: parseFloat(valueStr)
			};
		} else {
			result.value = parseFloat(value);
		}
	} else if (typeof value === 'number') {
		result.value = value;
	}

	return result;
};

/**
 * Формирует данные для осевых графиков rechart
 * @param {DiagramBuildData} data  - данные от сервера
 * @returns {RechartSeriesData} - данные для rechart
 */
const getSeriesData = (data: DiagramBuildData): RechartSeriesData => {
	const result = {
		data: [],
		percentStore: {}
	};
	const {labels, series} = data;

	labels.forEach((label, i) => {
		const item: RechartDataItem = {name: label};

		series.forEach(({data, dataKey, name}) => {
			const id = dataKey ?? name ?? 'value';
			const {percent, value} = getValueFromSeriesLabel(data[i]);

			if (value) {
				item[id] = value;

				if (percent) {
					result.percentStore[value] = percent;
				}
			} else {
				item[id] = 0;
			}
		});

		result.data.push(item);
	});

	return result;
};

/**
 * Формирует данные для комбо графиков rechart
 * @param {DiagramBuildData} data  - данные от сервера
 * @returns {RechartSeriesData} - данные для rechart
 */
const getComboSeriesData = (data: DiagramBuildData): RechartSeriesData => {
	const result = {
		data: [],
		percentStore: {}
	};
	const {labels, series} = data;

	labels.forEach((label, i) => {
		const item: RechartDataItem = {name: label};

		series.forEach(({data, dataKey, name}) => {
			const id = `${dataKey} ${name}`;
			const {percent, value} = getValueFromSeriesLabel(data[i]);

			if (value) {
				item[id] = value;

				if (percent) {
					result.percentStore[value] = percent;
				}
			} else {
				item[id] = 0;
			}
		});

		result.data.push(item);
	});

	return result;
};

/**
 * Формирует данные для круговых графиков rechart
 * @param {CircleWidget} widget - виджет
 * @param {DiagramBuildData} data - данные от сервера
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные цвета
 * @returns {RechartCircleData} - данные для rechart
 */
const getCircleSeriesData = (
	widget: CircleWidget,
	data: DiagramBuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings
): RechartCircleData => {
	const result = {
		data: [],
		percentStore: {}
	};

	const {labels, series} = data;
	const getColor = widget.colorsSettings.type === CHART_COLORS_SETTINGS_TYPES.AUTO
		? getAutoColor(widget.colorsSettings.auto.colors)
		: getColorForLabel(widget.colorsSettings.custom, globalColorsSettings);

	labels.forEach((label, i) => {
		const {percent, value} = getValueFromSeriesLabel(series[i]);

		if (value) {
			result.data.push({
				color: getColor(label, i),
				name: label,
				value
			});

			if (percent) {
				result.percentStore[value] = percent;
			}
		}
	});

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

const getPivotWidget = (widget: Widget): ?PivotWidget => {
	let result: ?PivotWidget = null;

	if (widget.type === WIDGET_TYPES.PIVOT_TABLE) {
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
 * @param {ContainerSize} container - общий контейнер
 * @param {Legend} legend - легенда
 * @returns {ReChartLegend} - ReChart легенда
 */
const getLegendOptions = (container: ContainerSize, legend: ?Legend): ReChartLegend => {
	if (legend) {
		const {displayType, fontFamily, fontSize, position, show, textHandler} = legend;
		const [align, verticalAlign] = transformLegendPosition(position);
		const {height: containerHeight, width: containerWidth} = container;
		let layout = LEGEND_LAYOUT.VERTICAL;
		let height;
		let width;
		const style = {fontFamily, fontSize, maxWidth: undefined};

		if (align === LEGEND_ALIGN.CENTER) {
			layout = displayType === LEGEND_DISPLAY_TYPES.BLOCK ? LEGEND_LAYOUT.VERTICAL : LEGEND_LAYOUT.HORIZONTAL;
			height = LEGEND_HEIGHT;
			width = containerWidth;
		} else {
			height = containerHeight - 10; // wrapper padding
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
 * Создает функцию для разделения строки на подстроки,
 * с максимальным количеством слов в подстроке, при условии
 * что все созданные подстроки будут менее указанной ширины
 * при выводе с заданными параметрами
 * @param {number} width - ширина строки
 * @param {AxisOptions} params - параметры оси
 * @returns {Function} - возвращает функцию форматирования
 */
const getSplitterLinesByWidth = (width: number, params: AxisOptions) => {
	// calculateStringsSize не рассчитывает ширину пробела, если передавать строку из одного пробела,
	// (рендринг оптимизирует и не отрисовывает пробельные символы)
	// поэтому используем хак - рассчитываем ширину пробела как разницу 2х строк
	const sizes = calculateStringsSize([['oo'], ['o o']], params.fontFamily, params.fontSize);
	const spaceSize = sizes[1].width - sizes[0].width;

	return (label: string) => {
		const labels = label.split(' ');
		const sizes = calculateStringsSize(labels.map(label => [label]), params.fontFamily, params.fontSize);
		const result = [];
		let curLine = [];
		let curSize = 0;

		labels.forEach((label, idx) => {
			const labelWidth = sizes[idx].width;
			const isEmptyCurrent = curLine.length === 0;
			const nextWidth = isEmptyCurrent ? labelWidth : curSize + spaceSize + labelWidth;

			if (nextWidth <= width) {
				curSize += nextWidth;
				curLine.push(label);
			} else if (curLine.length === 0) {
				result.push(label);
			} else {
				result.push(curLine.join(' '));
				curLine = [label];
				curSize = labelWidth;
			}
		});

		if (curLine.length > 0) {
			result.push(curLine.join(' '));
		}

		if (result.length === 0) {
			result.push('');
		}

		return result;
	};
};

/**
 * Проверяет, могут ли метки разместиться в несколько строках по оси X по ширине
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} axisWidth - ширина оси
 * @param {number} axisMaxHeight - максимальная высота для подписей
 * @returns {MultilineHeightResult | null} - минимальная ширина для меток, в случае успеха, null в противном случае
 */
const checkMultilineHeight = (
	labels: Array<string>,
	params: AxisOptions,
	axisWidth: number,
	axisMaxHeight: number
): MultilineHeightResult | null => {
	let result = null;
	const columnWidth = axisWidth / labels.length * 0.8;
	const multiLines = labels.map(getSplitterLinesByWidth(columnWidth, params));
	const multilineSizes = calculateStringsSize(multiLines, params.fontFamily, params.fontSize);
	const isLessWidth = multilineSizes.every(({width}) => width < columnWidth);
	const heights = multilineSizes.map(({height}) => height);
	const maxHeightLabels = Math.max(...heights);

	if (isLessWidth && maxHeightLabels < axisMaxHeight) {
		result = {
			height: maxHeightLabels,
			labels: multiLines
		};
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
			result = {...multiline, mode: LABEL_DRAW_MODE.MULTILINE};
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
 * Быстрый расчет высоты для категорий на оси X, когда нам изначально понятно,
 * что все надписи не влезут
 * @param {Array<string>} labels - метки данных
 * @param {AxisOptions} params - параметры оси
 * @param {number} maxHeight - максимальная ширина для подписей
 * @param {number} width - высота оси
 * @returns {CalculateCategoryRotateHeight} - высота и метод размещения меток
 */
const calculateCategoryRotateHeight = (
	labels: Array<string>,
	params: AxisOptions,
	maxHeight: number,
	width: number
): CalculateCategoryRotateHeight => {
	const fixWidth = width === 0 ? DEFAULT_WIDGET_WIDTH : width; // FIX: когда React еще не прокинул ref
	const interval = Math.trunc((labels.length * params.fontSize * ROTATE_AXIS_COEFFICIENT) / fixWidth);
	const calcLabels = interval === 0 ? labels : labels.filter((l, idx) => idx % (interval + 1) === 0);
	const rotateHeight = checkRotateHeight(calcLabels, params) + X_AXIS_HEIGHT;

	return {
		height: Math.min(maxHeight, rotateHeight),
		interval
	};
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

/**
 * Формирование настроек осей X при отображении категорий (столбчатая, линейная, комбо)
 * @param {AxisWidget | ComboWidget} widget - виджет
 * @param {ContainerSize} container - общий контейнер
 * @param {Array<string>} labels - подписи категорий
 * @param {string} axisName - название оси
 * @returns {AxisOptions} - настройки оси X
 */const getXAxisCategory = (
	widget: AxisWidget | ComboWidget,
	container: ContainerSize,
	labels: Array<string> = [],
	axisName: string = ''
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.parameter);
	const addPlaceForName = settings.showName ? settings.fontSize * 2 : 0;
	const maxHeight = LEGEND_HEIGHT - addPlaceForName;
	let {width} = container;

	if (widget.legend && widget.legend.show) {
		const {position} = widget.legend;

		if (position === LEGEND_POSITIONS.left || position === LEGEND_POSITIONS.right) {
			width -= width * LEGEND_WIDTH_PERCENT;
		}
	}

	let result;
	const fastRotateWidth = labels.length * settings.fontSize * ROTATE_AXIS_COEFFICIENT;

	if (width < fastRotateWidth) {
		const {height, interval} = calculateCategoryRotateHeight(labels, settings, maxHeight, width);

		result = {...settings, axisName, height, interval, mode: LABEL_DRAW_MODE.ROTATE};
	} else {
		const {height, labels: multilineLabels, mode} = calculateCategoryHeight(labels, settings, maxHeight, width);

		result = {...settings, axisName, height, interval: 0, mode, multilineLabels};
	}

	if (settings.showName) {
		const labels = widget.data.map(dataSet => dataSet.xAxisName);
		const labelSize = calculateStringsSize([labels], settings.fontFamily, settings.fontSize)[0];

		result.height += labelSize.height;
	}

	return result;
};

/**
 * Создает функцию и параметры для отображения промежуточных итогов по параметру
 * @param {AxisWidget} widget - виджет
 * @param {RechartData} data - данные по виджету
 * @param {boolean} usePercentage - признак того что в расчете используются проценты
 * @returns {SubTotalGetter} - функция и параметры для отображения промежуточных итогов, null - если показывать
 * промежуточные итоги не нужно.
 */
const makeSubTotalGetter = (widget: AxisWidget, data: RechartData, usePercentage: boolean): SubTotalGetter | null => {
	let result = null;

	if (widget.showSubTotalAmount && !usePercentage /* #SMRMEXT-13872 */) {
		const cache = {};

		data.forEach(({name, ...dataSet}) => {
			const sum = Object.values(dataSet).reduce((acc, item) => acc + (+item), 0);

			cache[name] = sum;
		});

		result = {
			getter: (parameter: string) => cache[parameter],
			position: usePercentage ? SUB_TOTAL_POSITION.INNER : SUB_TOTAL_POSITION.OUTER
		};
	}

	return result;
};

/**
 * Проверяет можно ли отображать промежуточные итоги по агрегации индикатора
 * @see #SMRMEXT-13872
 * @param {string} aggregation - агрегация индикатора
 * @returns {boolean} - true, если промежуточные итоги можно оторажать
 */
const canShowSubTotal = (aggregation: string) =>
	aggregation !== DEFAULT_AGGREGATION.PERCENT && aggregation !== DEFAULT_AGGREGATION.PERCENT_CNT;

export {
	calculateCategoryHeight,
	calculateCategoryRotateHeight,
	calculateCategoryWidth,
	calculateStringsSize,
	calculateYAxisNumberWidth,
	canShowSubTotal,
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
	getNiceScaleDTInterval,
	getPivotWidget,
	getRechartAxisSetting,
	getSeriesData,
	getSeriesInfo,
	getSpeedometerWidget,
	getSummaryWidget,
	getXAxisCategory,
	makeSubTotalGetter
};
