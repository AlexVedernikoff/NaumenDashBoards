// @flow
import type {
	Chart,
	CustomBreakdownChartColorsSettings,
	CustomLabelChartColorsSettings,
	Legend
} from 'store/widgets/data/types';
import {
	CHART_COLORS_SETTINGS_TYPES,
	CUSTOM_CHART_COLORS_SETTINGS_TYPES,
	WIDGET_TYPES
} from 'store/widgets/data/constants';
import {DEFAULT_BREAKDOWN_COLOR, DEFAULT_CHART_SETTINGS, DEFAULT_COLORS_SETTINGS} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getCustomColorsSettingsKey, getMainDataSet} from 'store/widgets/data/helpers';
import {hasBreakdown, hasUUIDsInLabels} from 'store/widgets/helpers';
import type {Options} from './types';
import {SEPARATOR} from 'src/store/widgets/buildData/constants';
import {store} from 'app.constants';

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

const setColors = (options: Options, widget: Chart, data: DiagramBuildData) => {
	const {colorsSettings = DEFAULT_COLORS_SETTINGS} = widget;
	const {auto: autoSettings, custom: customSettings, type} = colorsSettings;
	const currentKey = getCustomColorsSettingsKey(widget);
	const {breakdown, parameters} = getMainDataSet(widget.data);
	const parameterUsesUUIDs = hasUUIDsInLabels(parameters[0].attribute);
	const breakdownUsesUUIDs = !!breakdown && !Array.isArray(breakdown) && hasUUIDsInLabels(breakdown.attribute);
	const usesUUIDs = parameterUsesUUIDs || breakdownUsesUUIDs;
	let {data: customSettingsData, useGlobal} = customSettings;
	let extendedOptions = options;

	if (useGlobal) {
		customSettingsData = store.getState().dashboard.customChartColorsSettings;
	}

	const compareText = (text1: string, text2: string) => usesUUIDs && text1.includes(SEPARATOR) && text2.includes(SEPARATOR)
		? text1.split(SEPARATOR)[1] === text2.split(SEPARATOR)[1]
		: text1 === text2;

	const setLabelsColors = (options: Options, settings: CustomLabelChartColorsSettings, labels: Array<string>) => {
		const {colors: labelColors, defaultColor} = settings;
		const colors = Array(labels.length).fill(defaultColor);
		const usedLabels = [];

		labelColors.forEach(({color, text}) => {
			const index = labels.findIndex((label, index) => compareText(label, text) && !usedLabels.includes(index));

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

	const setBreakdownColors = (options: Options, settings: CustomBreakdownChartColorsSettings, series: Array<Object>) => {
		const {colors: breakdownColors} = settings;
		const colors = Array(series.length).fill(DEFAULT_BREAKDOWN_COLOR);
		const usedLabels = [];

		breakdownColors.forEach(({color, text}) => {
			const index = series.findIndex((s, index) => compareText(s.name, text) && !usedLabels.includes(index));

			if (index > -1) {
				if (color) {
					colors[index] = color;
				}

				usedLabels.push(index);
			}
		});

		return {
			...options,
			colors
		};
	};

	if (type === CHART_COLORS_SETTINGS_TYPES.CUSTOM && data && customSettingsData && customSettingsData.key === currentKey) {
		const {labels, series} = data;

		extendedOptions = customSettingsData.type === CUSTOM_CHART_COLORS_SETTINGS_TYPES.LABEL
			? setLabelsColors(extendedOptions, customSettingsData, labels)
			: setBreakdownColors(extendedOptions, customSettingsData, series);
	} else {
		extendedOptions = {
			...extendedOptions,
			colors: [...autoSettings.colors]
		};
	}

	return extendedOptions;
};

export {
	getLegendSettings,
	setColors
};
