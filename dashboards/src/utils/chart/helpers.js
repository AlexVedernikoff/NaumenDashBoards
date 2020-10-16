// @flow
import type {Chart, Legend} from 'store/widgets/data/types';
import {DEFAULT_CHART_SETTINGS} from './constants';
import {hasBreakdown} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

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

export {
	getLegendSettings
};
