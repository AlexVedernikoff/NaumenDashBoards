// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {createOrderName, getNumberFromName, getValue} from 'utils/widget';
import {CHART_VARIANTS} from 'utils/chart/constants';
import type {DiagramData} from 'store/widgets/diagrams/types';
import {drillDown} from 'store/widgets/links/actions';
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
		mixin.title = `${mixin.title}. ${attr.title}`;
		mixin.filters.push({attr, group, value});
	}
};

/**
 * Функция создания примеси для графиков с осями
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} data - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {DrillDownMixin} mixin - объект будущей примеси
 */
const axisChart = (widget: Widget, {categories, series}: DiagramData, config: any, mixin: DrillDownMixin) => {
	const {breakdown, breakdownGroup, group, xAxis} = widget;
	const {dataPointIndex, seriesIndex} = config;

	if (Array.isArray(categories) && Array.isArray(series)) {
		addFilter(mixin, xAxis, categories[dataPointIndex], getValue(group));
		addFilter(mixin, breakdown, series[seriesIndex].name, getValue(breakdownGroup));
	}
};

/**
 * Функция создания примеси для комбо графика
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} data - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {DrillDownMixin} mixin - объект будущей примеси
 */
const comboChart = (widget: Widget, {labels, series}: DiagramData, config: any, mixin: DrillDownMixin) => {
	const {dataPointIndex, seriesIndex} = config;
	let {dataKey} = series[seriesIndex];

	const currentKey = Object.keys(widget)
		.filter(key => key.startsWith(FIELDS.dataKey))
		.find(key => widget[key] === dataKey);

	if (currentKey) {
		const currentNumber = getNumberFromName(currentKey);
		const xAxis = widget[createOrderName(currentNumber)(FIELDS.xAxis)];
		const group = widget[createOrderName(currentNumber)(FIELDS.group)];
		const breakdown = widget[createOrderName(currentNumber)(FIELDS.breakdown)];
		const breakdownGroup = widget[createOrderName(currentNumber)(FIELDS.breakdownGroup)];
		const cases = [];
		let classFqn = getValue(widget[createOrderName(currentNumber)(FIELDS.source)]);

		mixin.classFqn = classFqn;

		addFilter(mixin, xAxis, labels[dataPointIndex], getValue(group));
		addFilter(mixin, breakdown, series[seriesIndex].breakdownValue, getValue(breakdownGroup));

		if (classFqn && classFqn.includes('$')) {
			const parts = classFqn.split('$');
			classFqn = parts.shift();
			cases.push(parts.pop());

			mixin.classFqn = classFqn;
			mixin.cases = cases;
		}
	}
};

/**
 * Функция создания примеси для круговых графиков
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} data - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {DrillDownMixin} mixin - объект будущей примеси
 */
const circleChart = (widget: Widget, {labels}: DiagramData, {dataPointIndex}: any, mixin: DrillDownMixin) => {
	const {breakdown, breakdownGroup} = widget;

	if (Array.isArray(labels)) {
		addFilter(mixin, breakdown, labels[dataPointIndex], getValue(breakdownGroup));
	}
};

/**
 * В зависимости от типа диаграммы выбираем функцию создания примеси
 * @param {string} type - тип диаграммы
 * @returns {Function} - функция создания примеси
 */
const resolveMixinCreator = (type: string) => {
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
 * @param {DiagramData} chart - данные для построения графика
 * @returns {ThunkAction}
 */
const drillDownBySelection = (widget: Widget, chart: DiagramData) => (event: any, chartContext: any, config: any) => {
	const {diagramName, type} = widget;
	const mixin = {
		filters: [],
		title: diagramName
	};

	resolveMixinCreator(type.value)(widget, chart, config, mixin);
	store.dispatch(drillDown(widget, mixin));
};

export {
	drillDownBySelection
};
