// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {CHART_VARIANTS} from 'utils/chart/constants';
import {createOrderName} from 'utils/widget';
import type {DiagramData} from 'store/widgets/diagrams/types';
import {goOver} from 'store/widgets/links/actions';
import type {GoOverMixin} from 'store/widgets/links/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {store} from 'src';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

/**
 * Добавляем данные фильтра в объект примеси
 * @param {GoOverMixin} mixin - объект примеси
 * @param {?Attribute} attr - атрибут по которому нужно будет провести фильтрацию для получения данных
 * выбранной области.
 * @param {string | number} value - значение атрибута
 */
const addFilter = (mixin: GoOverMixin, attr: ?Attribute, value: string | number) => {
	if (attr) {
		mixin.title = `${mixin.title}. ${attr.title}`;
		mixin.filters.push({
			code: attr.code,
			value
		});
	}
};

/**
 * Функция создания примеси для графиков с осями
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} chart - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {GoOverMixin} mixin - объект будущей примеси
 */
const axisChart = (widget: Widget, chart: DiagramData, config: any, mixin: GoOverMixin) => {
	const {xAxis, breakdown} = widget;
	const {dataPointIndex, seriesIndex, w} = config;

	addFilter(mixin, xAxis, chart.categories[dataPointIndex]);
	addFilter(mixin, breakdown, w.globals.seriesNames[seriesIndex]);
};

/**
 * Функция создания примеси для комбо графика
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} chart - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {GoOverMixin} mixin - объект будущей примеси
 */
const comboChart = (widget: Widget, chart: DiagramData, config: any, mixin: GoOverMixin) => {
	const {order} = widget;
	const {dataPointIndex, seriesIndex, w} = config;
	const {labels, seriesNames} = w.globals;

	if (order) {
		order.forEach(num => {
			const sourceName = createOrderName(num)(FIELDS.source);
			const source = widget[sourceName];

			if (source && source.label === seriesNames[seriesIndex]) {
				let classFqn = source.value;
				let cases = [];
				const xAxis = widget[createOrderName(num)(FIELDS.xAxis)];

				addFilter(mixin, xAxis, labels[dataPointIndex]);

				if (classFqn && classFqn.includes('$')) {
					const parts = classFqn.split('$');
					classFqn = parts.shift();
					cases.push(parts.pop());
				}

				mixin = {...mixin, classFqn, cases};
			}
		});
	}
};

/**
 * Функция создания примеси для круговых графиков
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} chart - данные для построение графика
 * @param {any} config - конфиг построенного графика
 * @param {GoOverMixin} mixin - объект будущей примеси
 */
const circleChart = (widget: Widget, chart: DiagramData, config: any, mixin: GoOverMixin) => {
	const {breakdown} = widget;
	const {dataPointIndex, w} = config;

	addFilter(mixin, breakdown, w.globals.labels[dataPointIndex]);
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
const goOverBySelection = (widget: Widget, chart: DiagramData) => (event: any, chartContext: any, config: any) => {
	const {diagramName, type} = widget;
	const mixin = {
		filters: [],
		title: diagramName
	};

	resolveMixinCreator(type.value)(widget, chart, config, mixin);
	store.dispatch(goOver(widget.id, mixin));
};

export {
	goOverBySelection
};
