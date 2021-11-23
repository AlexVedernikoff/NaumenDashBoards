// @flow
import type {AddFilterProps, AddFiltersProps, ReturnsAddFiltersData} from './types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {AxisData, AxisWidget, Chart, ChartDataSet, CircleWidget, ComboData, ComboWidget, Group, MixedAttribute} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {deepClone} from 'helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDown} from 'store/widgets/links/actions';
import type {DrillDownMixin} from 'store/widgets/links/types';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {getLabelWithoutUUID} from 'utils/chart/mixins/helpers';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {hasUUIDsInLabels} from 'store/widgets/helpers';
import isMobile from 'ismobilejs';
import {setWarningMessage} from 'store/widgets/data/actions';
import {store} from 'app.constants';
import type {ThunkAction} from 'store/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Определяет нужно ли проводить очистку значений для фильтрации в drilldown
 * @param {Attribute} attribute - Атрибут
 * @param {Group} group - группировка атрибута
 * @returns {boolean} - Необходимость очищать значения для фильтрации
 */
const isNeedsClearedValue = (attribute: Attribute, group: Group): boolean => {
	const {dtInterval, metaClass, state} = ATTRIBUTE_TYPES;
	const noNeedToCleanTypes = {...ATTRIBUTE_SETS.REFERENCE, dtInterval, metaClass, state};
	const isExcludeType = getAttributeValue(attribute, 'type') in noNeedToCleanTypes && group.way === GROUP_WAYS.SYSTEM;
	const isRefWithTitle = attribute.type in ATTRIBUTE_SETS.REFERENCE && !!(attribute.ref && attribute.ref.code === 'title');

	return !(isExcludeType || isRefWithTitle);
};

/**
 * Добавляет фильтр группировки
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @param {AddFilterProps} props - данные для нового фильтра
 * @returns {DrillDownMixin}
 */
const addGroupFilter = (mixin: DrillDownMixin, props: AddFilterProps): DrillDownMixin => {
	const {attribute, group, value} = props;
	let newMixin = mixin;

	if (attribute && group) {
		newMixin = deepClone(mixin);
		const clearedValue = hasUUIDsInLabels(attribute, group) ? getLabelWithoutUUID(value) : value;

		if (clearedValue) {
			newMixin.title = `${mixin.title}. ${clearedValue}`;
		}

		newMixin.filters.push({
			attribute,
			group,
			value: isNeedsClearedValue(attribute, group) ? clearedValue : value
		});
	}

	return newMixin;
};

/**
 * Добавляет в примесь данных данные параметра
 * @param {AxisData} dataSet - набор данных виджета
 * @param {string} value - значение параметра
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @returns {DrillDownMixin}
 */
const addParameterFilter = (dataSet: AxisData, value: string, mixin: DrillDownMixin): DrillDownMixin => {
	const {attribute, group} = dataSet.parameters[0];

	return addGroupFilter(mixin, { attribute, group, value });
};

/**
 * Добавляет в примесь данных данные разбивки
 *
 * @param {ChartDataSet} dataSet - набор данных виджета
 * @param {string} value - значение разбивки
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @returns {DrillDownMixin}
 */
const addBreakdownFilter = (dataSet: ChartDataSet, value: string, mixin: DrillDownMixin): DrillDownMixin => {
	const {breakdown} = dataSet;
	const breakdownSet = breakdown && breakdown.find(attrSet => attrSet.dataKey === dataSet.dataKey);
	let newMixin = mixin;

	if (breakdownSet) {
		const {attribute, group} = breakdownSet;

		newMixin = addGroupFilter(mixin, { attribute, group, value });
	}

	return newMixin;
};

/**
 * Функция создания примеси для графиков с осями
 * @param {AxisWidget} widget - данные виджета
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {ReturnsAddFiltersData} - массив, содержащий индекс выбранного набора данных и примесь данных для
 * перехода на список объектов
 */
const addAxisChartFilters = (widget: AxisWidget, props: AddFiltersProps): ReturnsAddFiltersData => {
	const {buildData, config, mixin} = props;
	const {labels, series} = buildData;
	const {dataPointIndex, seriesIndex} = config;
	const {data} = widget;
	const index = getMainDataSetIndex(widget.data);
	const dataSet = data[index];
	let newMixin = mixin;

	if (dataSet) {
		const {aggregation, attribute} = dataSet.indicators[0];

		attribute && newMixin.filters.push({aggregation, attribute});
		newMixin = addParameterFilter(dataSet, labels[dataPointIndex], newMixin);
		newMixin = addBreakdownFilter(dataSet, series[seriesIndex].name, newMixin);
	}

	return [index, newMixin];
};

/**
 * Функция создания примеси для комбо графика
 * @param {ComboWidget} widget - данные виджета
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {ReturnsAddFiltersData} - массив, содержащий индекс выбранного набора данных и примесь данных для
 * перехода на список объектов
 */
const addComboChartFilters = (widget: ComboWidget, props: AddFiltersProps): ReturnsAddFiltersData => {
	const {buildData, config, mixin} = props;
	const {labels, series} = buildData;
	const {dataPointIndex, seriesIndex} = config;
	const {data} = widget;
	const index = data.findIndex(dataSet => dataSet.dataKey === buildData.series[config.seriesIndex].dataKey);
	const dataSet = widget.data[index];
	let newMixin = mixin;

	if (dataSet) {
		const {aggregation, attribute} = dataSet.indicators[0];

		attribute && newMixin.filters.push({aggregation, attribute});
		newMixin = addParameterFilter(dataSet, labels[dataPointIndex], newMixin);
		newMixin = addBreakdownFilter(dataSet, series[seriesIndex].name, newMixin);
	}

	return [index, newMixin];
};

/**
 * Добавляет фильтр для круговых графиков
 * @param {CircleWidget} widget - данные виджета-графика
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {ReturnsAddFiltersData} - массив, содержащий индекс выбранного набора данных и примесь данных для
 * перехода на список объектов
 */
const addCircleChartFilters = (widget: CircleWidget, props: AddFiltersProps): ReturnsAddFiltersData => {
	const {buildData, config, mixin} = props;
	const {dataPointIndex} = config;
	const {data} = widget;
	const index = getMainDataSetIndex(data);
	const dataSet = widget.data[index];
	let newMixin = mixin;

	if (dataSet) {
		const {aggregation, attribute} = dataSet.indicators[0];

		attribute && newMixin.filters.push({aggregation, attribute});
		newMixin = addBreakdownFilter(data[index], buildData.labels[dataPointIndex], newMixin);
	}

	return [index, newMixin];
};

/**
 * В зависимости от типа диаграммы вызывается необходимая функция для добавления фильтров
 * @param {Chart} widget - данные виджета-графика
 * @param {AddFiltersProps} props - данные для добавления фильтров
 * @returns {ReturnsAddFiltersData} - массив, содержащий индекс выбранного набора данных и примесь данных для
 * перехода на список объектов
 */
const addFilters = (widget: Chart, props: AddFiltersProps): ReturnsAddFiltersData => {
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
			return [-1, props.mixin];
	}
};

/**
 * Определяет нужно ли по данному типу аттрибута производить DrillDown
 * @param {Attribute} attribute - атрибут для проверки
 * @returns {boolean} - возвращает true, если по данному атрибуту данные в дриллдауне будут ожидаемыми.
 * false - если по этому атрибуту нельзя построить валидную выборку.
 */
const hasAttributeDrillDown = (attribute: MixedAttribute | null) => {
	if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
		const isDateType = getAttributeValue(attribute, 'type') === ATTRIBUTE_TYPES.dtInterval;
		const isServiceCallEvt = attribute.metaClassFqn === 'serviceCall__Evt';
		const isTimerValue = !!attribute.timerValue;

		return !isDateType && !isServiceCallEvt && !isTimerValue;
	}

	return true;
};

/**
 * Определяет можно ли при указанных метаданных для построения виджета производить DrillDown, согласно параметру или разбивке
 * @param {AxisData | ComboData} dataSet - метаданные для построения виджета с выставленным параметром или разбивкой
 * @returns {boolean} - возвращает true, если по указанным метаданным для построения виджета данные в дриллдауне будут ожидаемыми.
 * false - если по указанным метаданным нельзя построить валидную выборку.
 */
const hasDrillDownByParameter = (dataSet: AxisData | ComboData) => {
	const {attribute} = Array.isArray(dataSet.breakdown) ? dataSet.breakdown[0] : dataSet.parameters[0];
	return hasAttributeDrillDown(attribute);
};

/**
 * Определяет можно ли в данном Axis-виджете производить DrillDown
 * @param {AxisWidget} widget - виджет для проверки
 * @returns {boolean} - возвращает true, если по данному осевому виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному осевому виджету нельзя построить валидную выборку.
 */
const hasDrillDownAxisWidget = (widget: AxisWidget) => {
	const {data} = widget;
	const index = getMainDataSetIndex(widget.data);
	const dataSet = data[index];

	return hasDrillDownByParameter(dataSet);
};

/**
 * Определяет можно ли в данном Combo-виджете производить DrillDown
 * @param {ComboWidget} widget - виджет для проверки
 * @param {DiagramBuildData} buildData - данные для построения
 * @param {number} seriesIndex - нндекс массива данных
 * @returns {boolean} - возвращает true, если по данному комбо-виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному комбо-виджету нельзя построить валидную выборку.
 */
const hasDrillDownComboWidget = (widget: ComboWidget, buildData: DiagramBuildData, seriesIndex) => {
	const {data} = widget;
	const index = data.findIndex(dataSet => dataSet.dataKey === buildData.series[seriesIndex].dataKey);
	const dataSet = data[index];

	return hasDrillDownByParameter(dataSet);
};

/**
 * Определяет можно ли в данном Circle-виджете производить DrillDown
 * @param {CircleWidget} widget - Виджет
 * @returns {boolean} - возвращает true, если по данному круговому виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному круговому виджету нельзя построить валидную выборку.
 */
const hasDrillDownCircleWidget = (widget: CircleWidget) => {
	const {data} = widget;
	const index = getMainDataSetIndex(widget.data);
	const dataSet = data[index];

	if (dataSet) {
		const {attribute} = dataSet.breakdown[0];

		return hasAttributeDrillDown(attribute);
	}

	return false;
};

/**
 * Определяет можно ли в данном виджете производить DrillDown
 * @param {Chart} widget - Виджет
 * @param {DiagramBuildData} buildData - данные для построения
 * @param {number} seriesIndex - нндекс массива данных
 * @returns {boolean} - возвращает true, если по данному виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному виджету нельзя построить валидную выборку.
 */
const hasDrillDownWidget = (widget: Chart, buildData: DiagramBuildData, seriesIndex: number): boolean => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = WIDGET_TYPES;

	switch (widget.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return hasDrillDownAxisWidget(widget);
		case COMBO:
			return hasDrillDownComboWidget(widget, buildData, seriesIndex);
		case DONUT:
		case PIE:
			return hasDrillDownCircleWidget(widget);
		default:
			return false;
	}
};

/**
 * Обработчик для события выбора конкретной части диаграммы.
 * Добавляет фильтры для перехода на список построения
 * @param {Chart} widget - данные виджета
 * @param {DiagramBuildData} buildData - данные для построения графика
 * @returns {ThunkAction}
 */
const drillDownBySelection = (widget: Chart, buildData: DiagramBuildData) => (event: MouseEvent, chartContext: Object, config: Object) => {
	event.stopPropagation();

	if (!isMobile().any) {
		if (hasDrillDownWidget(widget, buildData, config.seriesIndex)) {
			const [index, mixin] = addFilters(widget, {
				buildData,
				config,
				mixin: createDrillDownMixin(widget)
			});

			if (index !== -1) {
				store.dispatch(drillDown(widget, index, mixin));
			}
		} else {
			const {id} = widget;

			store.dispatch(setWarningMessage({id, message: 'Для данного виджета детализация данных не доступна'}));
		}
	}
};

export {
	drillDownBySelection
};
