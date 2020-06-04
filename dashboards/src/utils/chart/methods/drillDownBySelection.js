// @flow
import type {AddFilterProps, AddFiltersProps} from './types';
import type {AxisWidget, Chart, CircleWidget, ComboWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDown} from 'store/widgets/links/actions';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {store} from 'src';
import type {ThunkAction} from 'store/types';
import {transformGroupFormat} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Добавляет фильтр
 * @param {AddFilterProps} props - данные для нового фильтра
 */
const addFilter = (props: AddFilterProps) => {
	const {attribute, group, mixin, value} = props;

	if (attribute && group) {
		if (value) {
			mixin.title = `${mixin.title}. ${value}`;
		}
		// $FlowFixMe
		mixin.filters.push({attribute, group, value});
	}
};

const addBreakdownFilter = (set: Object, value: number, mixin: Object) => {
	const breakdown = set[FIELDS.breakdown];

	if (Array.isArray(breakdown)) {
		const breakdownSet = breakdown.find(attrSet => attrSet[FIELDS.dataKey] === set.dataKey);

		if (breakdownSet) {
			addFilter({
				attribute: breakdownSet.value,
				group: transformGroupFormat(breakdownSet.group),
				mixin,
				value
			});
		}
	} else {
		addFilter({
			attribute: breakdown,
			group: transformGroupFormat(set[FIELDS.breakdownGroup]),
			mixin,
			value
		});
	}
};

/**
 * Функция создания примеси для графиков с осями
 * @param {AxisWidget} widget - данные виджета
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {number} index - индекс набора данных массива data виджета
 */
const addAxisChartFilters = (widget: AxisWidget, props: AddFiltersProps) => {
	const {buildData, config, mixin} = props;
	const {categories, series} = buildData;
	const {dataPointIndex, seriesIndex} = config;
	const {data} = widget;
	const index = data.findIndex(set => !set.sourceForCompute);

	if (index !== -1) {
		const set = data[index];

		addFilter({
			attribute: set[FIELDS.xAxis],
			group: transformGroupFormat(set[FIELDS.group]),
			mixin,
			value: categories[dataPointIndex]
		});

		addBreakdownFilter(set, series[seriesIndex].name, mixin);
	}

	return index;
};

/**
 * Функция создания примеси для комбо графика
 * @param {ComboWidget} widget - данные виджета
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {number} index - индекс набора данных массива data виджета
 */
const addComboChartFilters = (widget: ComboWidget, props: AddFiltersProps) => {
	const {buildData, config, mixin} = props;
	const {labels, series} = buildData;
	const {dataPointIndex, seriesIndex} = config;
	const {data} = widget;
	const index = data.findIndex(set => set.dataKey === buildData.series[config.seriesIndex].dataKey);

	if (index !== -1) {
		const set = widget.data[index];

		addFilter({
			attribute: set[FIELDS.xAxis],
			group: transformGroupFormat(set[FIELDS.group]),
			mixin,
			value: labels[dataPointIndex]
		});

		addBreakdownFilter(set, series[seriesIndex].name, mixin);
	}

	return index;
};

/**
 * Добавляет фильтр для круговых графиков
 * @param {CircleWidget} widget - данные виджета-графика
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {number} index - индекс набора данных массива data виджета
 */
const addCircleChartFilters = (widget, props: AddFiltersProps) => {
	const {buildData, config, mixin} = props;
	const {dataPointIndex} = config;
	const {data} = widget;
	const index = data.findIndex(set => !set.sourceForCompute);

	if (index !== -1) {
		addBreakdownFilter(data[index], buildData.labels[dataPointIndex], mixin);
	}

	return index;
};

/**
 * В зависимости от типа диаграммы вызывается необходимая функция для добавления фильтров
 * @param {Chart} widget - данные виджета-графика
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {number} index - индекс набора данных массива data виджета
 */
const addFilters = (widget: Chart, props: AddFiltersProps) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = WIDGET_TYPES;

	switch (widget.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return addAxisChartFilters(widget, props);
		case COMBO:
			return addComboChartFilters(widget, props);
		case DONUT:
		case PIE:
			return addCircleChartFilters(widget, props);
		default:
			return -1;
	}
};

/**
 * Обработчик для события выбора конкретной части диаграммы.
 * Добавляет фильтры для перехода на список построения
 * @param {Chart} widget - данные виджета
 * @param {DiagramBuildData} buildData - данные для построения графика
 * @returns {ThunkAction}
 */
const drillDownBySelection = (widget: Chart, buildData: DiagramBuildData) =>
	(event: MouseEvent, chartContext: Object, config: Object) => {
	const {header} = widget;
	const mixin = {
		filters: [],
		title: header.name
	};

	const index = addFilters(widget, {
		buildData,
		config,
		mixin
	});

	event.stopPropagation();

	if (index !== -1) {
		store.dispatch(drillDown(widget, index, mixin));
	}
};

export {
	drillDownBySelection
};
