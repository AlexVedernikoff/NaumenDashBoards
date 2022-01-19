// @flow
import type {Chart, CustomChartColorsSettingsData, Legend} from 'store/widgets/data/types';
import {CHART_COLORS_SETTINGS_TYPES, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getCustomColorsSettingsKey} from 'store/widgets/data/helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {hasBreakdown, isCircleChart} from 'store/widgets/helpers';
import type {Options} from './types';
import {SEPARATOR} from 'store/widgets/buildData/constants';

/**
 * Возвращает настройки легенды в зависимости от параметров переданного виджета
 * @param {Chart} widget - виджет
 * @returns {Legend} - настройки легенды
 */
const getLegendSettings = (widget: Chart) => {
	const {type} = widget;
	const {BAR, COLUMN, LINE} = WIDGET_TYPES;
	const show = ![BAR, COLUMN, LINE].includes(type) || hasBreakdown(widget);

	return {
		...DEFAULT_CHART_SETTINGS.legend,
		show
	};
};

/**
 * Сравнивает значения лейблов
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
 * Устанавливает цвета для отрисовки графика
 * @param {Options} options - опции графика
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные для построения виджета
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные настройки цветов
 * @returns {boolean}
 */
const setColors = (
	options: Options,
	widget: Chart,
	data: DiagramBuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings
) => {
	const {colorsSettings} = widget;
	const {auto: autoSettings, custom: customSettings, type} = colorsSettings;
	const {CUSTOM} = CHART_COLORS_SETTINGS_TYPES;
	const currentKey = type === CUSTOM && getCustomColorsSettingsKey(widget);
	let {data: customSettingsData, useGlobal} = customSettings;
	let extendedOptions = options;

	/**
	 * Устанавливает цвета для лейблов оси X
	 * @param {Options} options - опции графика
	 * @param {CustomChartColorsSettingsData} settings - настройки цветов
	 * @param {Array<string>} labels - лейблы оси X
	 * @returns {Options}
	 */
	const setLabelsColors = (options: Options, settings: CustomChartColorsSettingsData, labels: Array<string>) => {
		const {colors: labelColors, defaultColor} = settings;
		const colors = Array(labels.length).fill(defaultColor);
		const usedLabels = [];

		labelColors.forEach(({color, key}) => {
			const index = labels.findIndex((label, index) => equalLabels(label, key) && !usedLabels.includes(index));

			if (index > -1) {
				colors[index] = color;
				usedLabels.push(index);
			}
		});

		return {
			...options,
			colors,
			plotOptions: {
				bar: {
					distributed: true
				}
			}
		};
	};

	/**
	 * Устанавливает цвета для значений разбивки
	 * @param {Options} options - опции графика
	 * @param {CustomChartColorsSettingsData} settings - настройки цветов
	 * @returns {Options}
	 */
	const setBreakdownColors = (options: Options, settings: CustomChartColorsSettingsData) => {
		const {labels, series} = data;
		const colorsLabels = isCircleChart(widget.type) ? labels : series.map(s => s.name);

		return {
			...options,
			colors: getBreakdownColors(settings, colorsLabels)
		};
	};

	if (useGlobal && globalColorsSettings) {
		customSettingsData = globalColorsSettings;
	}

	if (type === CUSTOM && customSettingsData && customSettingsData.key === currentKey) {
		extendedOptions = hasBreakdown(widget)
			? setBreakdownColors(extendedOptions, customSettingsData)
			: setLabelsColors(extendedOptions, customSettingsData, data.labels);
	} else {
		extendedOptions = {
			...extendedOptions,
			colors: [...autoSettings.colors]
		};
	}

	return extendedOptions;
};

export {
	getBreakdownColors,
	getLegendSettings,
	equalLabels,
	setColors
};
