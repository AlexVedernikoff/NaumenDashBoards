// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {createOrdinalName, getMainOrdinalNumber, getNumberFromName} from 'utils/widget';
import {CHART_VARIANTS} from 'utils/chart/constants';
import {drillDown} from 'store/widgets/links/actions';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {store} from 'src';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

/**
 * Добавляем данные фильтра в объект примеси
 * @param {DrillDownMixin} mixin - объект примеси
 * @param {?Attribute} attr - атрибут по которому нужно будет провести фильтрацию для получения данных
 * выбранной области.
 * @param {string | number} value - значение атрибута
 * @param {?string} group - значение для группировки (опционально для графиков с осями)
 */
const addFilter = (mixin: DrillDownMixin, attr: ?Attribute, value: string | number, group: ?string) => {
	if (attr) {
		if (value) {
			mixin.title = `${mixin.title}. ${value}`;
		}

		mixin.filters.push({attr, group, value});
	}
};

/**
 * Функция создания примеси для графиков с осями
 * @param {Widget} widget - данные виджета
 * @param {DiagramBuildData} data - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {DrillDownMixin} mixin - объект будущей примеси
 */
const axisChart = (widget: Widget, {categories, series}: DiagramBuildData, config: any, mixin: DrillDownMixin) => {
	const {dataPointIndex, seriesIndex} = config;
	let breakdown, breakdownGroup, group, mainNumber, xAxis;

	if (!widget.order) {
		xAxis = widget[FIELDS.xAxis];
		group = widget[FIELDS.group];
		breakdown = widget[FIELDS.breakdown];
		breakdownGroup = widget[FIELDS.breakdownGroup];
	} else {
		mainNumber = getMainOrdinalNumber(widget);
		xAxis = widget[createOrdinalName(FIELDS.xAxis, mainNumber)];
		group = widget[createOrdinalName(FIELDS.group, mainNumber)];
		breakdown = widget[createOrdinalName(FIELDS.breakdown, mainNumber)];
		breakdownGroup = widget[createOrdinalName(FIELDS.breakdownGroup, mainNumber)];
	}

	if (Array.isArray(categories) && Array.isArray(series)) {
		addFilter(mixin, xAxis, categories[dataPointIndex], group);
		addFilter(mixin, breakdown, series[seriesIndex].name, breakdownGroup);
	}

	store.dispatch(drillDown(widget, mainNumber, mixin));
};

/**
 * Функция создания примеси для комбо графика
 * @param {Widget} widget - данные виджета
 * @param {DiagramBuildData} data - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {DrillDownMixin} mixin - объект будущей примеси
 */
const comboChart = (widget: Widget, {labels, series}: DiagramBuildData, config: any, mixin: DrillDownMixin) => {
	const {dataPointIndex, seriesIndex} = config;
	let {dataKey} = series[seriesIndex];

	const currentKey = Object.keys(widget)
		.filter(key => key.startsWith(FIELDS.dataKey))
		.find(key => widget[key] === dataKey);

	if (currentKey) {
		const currentNumber = getNumberFromName(currentKey);
		const xAxis = widget[createOrdinalName(FIELDS.xAxis, currentNumber)];
		const group = widget[createOrdinalName(FIELDS.group, currentNumber)];
		const breakdown = widget[createOrdinalName(FIELDS.breakdown, currentNumber)];
		const breakdownGroup = widget[createOrdinalName(FIELDS.breakdownGroup, currentNumber)];

		addFilter(mixin, xAxis, labels[dataPointIndex], group);
		addFilter(mixin, breakdown, series[seriesIndex].breakdownValue, breakdownGroup);

		store.dispatch(drillDown(widget, currentNumber, mixin));
	}
};

/**
 * Функция создания примеси для круговых графиков
 * @param {Widget} widget - данные виджета
 * @param {DiagramBuildData} data - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {DrillDownMixin} mixin - объект будущей примеси
 */
const circleChart = (widget: Widget, {labels}: DiagramBuildData, {dataPointIndex}: any, mixin: DrillDownMixin) => {
	let breakdown, breakdownGroup, mainNumber;

	if (!widget.order) {
		breakdown = widget[FIELDS.breakdown];
		breakdownGroup = widget[FIELDS.breakdownGroup];
	} else {
		mainNumber = getMainOrdinalNumber(widget);
		breakdown = widget[createOrdinalName(FIELDS.breakdown, mainNumber)];
		breakdownGroup = widget[createOrdinalName(FIELDS.breakdownGroup, mainNumber)];
	}

	if (Array.isArray(labels)) {
		addFilter(mixin, breakdown, labels[dataPointIndex], breakdownGroup);
	}

	store.dispatch(drillDown(widget, mainNumber, mixin));
};

/**
 * В зависимости от типа диаграммы выбираем функцию создания примеси
 * @param {string} type - тип диаграммы
 * @returns {Function} - функция создания примеси
 */
const resolve = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;

	const creators = {
		[BAR]: axisChart,
		[BAR_STACKED]: axisChart,
		[COLUMN]: axisChart,
		[COLUMN_STACKED]: axisChart,
		[COMBO]: comboChart,
		[DONUT]: circleChart,
		[LINE]: axisChart,
		[PIE]: circleChart
	};

	return creators[type];
};

/**
 * Обработчик для события выбора конкретной части диаграммы.
 * Определяем по типу нужную функцию для создания примеси с данными выбранной области
 * и передаем созданную примесь в функцию перехода на список объектов.
 * @param {Widget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные для построения графика
 * @returns {ThunkAction}
 */
const drillDownBySelection = (widget: Widget, chart: DiagramBuildData) => (event: any, chartContext: any, config: any) => {
	const {diagramName, type} = widget;
	const mixin = {
		filters: [],
		title: diagramName
	};

	resolve(type)(widget, chart, config, mixin);
};

export {
	drillDownBySelection
};
