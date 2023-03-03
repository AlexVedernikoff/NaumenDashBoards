// @flow
import type {
	AddFilterProps,
	DrillDownOptions,
	FoundPivotIndicatorInfo,
	GetCircleDrillDownOptions,
	GetComboDrillDownOptions,
	GetDrillDownOptions,
	GetPivotDrillDownOptions
} from './types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {
	AxisData,
	AxisWidget,
	ChartDataSet,
	CircleData,
	CircleWidget,
	ComboData,
	ComboWidget,
	Group,
	MixedAttribute,
	PivotIndicator,
	PivotWidget
} from 'store/widgets/data/types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import {getAttributeValue, getSourceAttribute} from 'store/sources/attributes/helpers';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import {getSeparatedLabel} from 'store/widgets/buildData/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {hasUUIDsInLabels} from 'store/widgets/helpers';
import isMobile from 'ismobilejs';

/**
 * Определяет нужно ли проводить очистку значений для фильтрации в drilldown
 * @param {Attribute} attribute - Атрибут
 * @param {Group} group - группировка атрибута
 * @returns {boolean} - возвращает `true`, если нужно очищать значения для фильтрации
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
 * @returns {void}
 */
const updateGroupFilter = (mixin: DrillDownMixin, props: AddFilterProps): void => {
	const {attribute, descriptor, group, value} = props;

	if (attribute && group) {
		const clearedValue = hasUUIDsInLabels(attribute, group) ? getSeparatedLabel(value) : value;

		if (clearedValue) {
			mixin.title = `${mixin.title}. ${clearedValue}`;
		}

		mixin.filters.push({
			attribute,
			descriptor,
			group,
			value: isNeedsClearedValue(attribute, group) ? clearedValue : value
		});
	}
};

/**
 * Добавляет в примесь данных данные индикатора
 * @param {AxisData | CircleData} dataSet - набор данных виджета
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @returns {void}
 */
const addIndicatorInfo = (dataSet: AxisData | CircleData | ComboData, mixin: DrillDownMixin): void => {
	const {aggregation, attribute} = dataSet.indicators[0];

	if (attribute) {
		mixin.filters.push({aggregation, attribute});
	}
};

/**
 * Добавляет в примесь данных данные параметра
 * @param {AxisData} dataSet - набор данных виджета
 * @param {string} value - значение параметра
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @returns {void}
 */
const addParameterFilter = (dataSet: AxisData | ComboData, value: string, mixin: DrillDownMixin): void => {
	const {attribute, group} = dataSet.parameters[0];
	return updateGroupFilter(mixin, {attribute, group, value});
};

/**
 * Добавляет в примесь данных данные разбивки
 * @param {ChartDataSet} dataSet - набор данных виджета
 * @param {string} value - значение разбивки
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @returns {void}
 */
const addBreakdownFilter = (dataSet: ChartDataSet, value: string, mixin: DrillDownMixin): void => {
	const {breakdown} = dataSet;
	const breakdownSet = breakdown && breakdown.find(attrSet => attrSet.dataKey === dataSet.dataKey);

	if (breakdownSet) {
		const {attribute, group} = breakdownSet;

		updateGroupFilter(mixin, {attribute, group, value});
	}
};

/**
 * Определяет нужно ли по данному типу аттрибута производить DrillDown
 * @param {Attribute} attribute - атрибут для проверки
 * @returns {boolean} - возвращает true, если по данному атрибуту данные в дриллдауне будут ожидаемыми.
 * false - если по этому атрибуту нельзя построить корректную выборку.
 */
const hasAttributeDrillDown = (attribute: MixedAttribute | null) => {
	const sourceAttribute = getSourceAttribute(attribute);

	if (sourceAttribute) {
		const isDateType = getAttributeValue(sourceAttribute, 'type') === ATTRIBUTE_TYPES.dtInterval;
		const isServiceCallEvt = sourceAttribute.metaClassFqn === 'serviceCall__Evt';

		return !isDateType && !isServiceCallEvt;
	}

	return true;
};

/**
 * Определяет можно ли при указанных метаданных для построения виджета производить DrillDown, согласно параметру или разбивке
 * @param {AxisData | ComboData} dataSet - метаданные для построения виджета с выставленным параметром или разбивкой
 * @returns {boolean} - возвращает true, если по указанным метаданным для построения виджета данные в дриллдауне будут ожидаемыми.
 * false - если по указанным метаданным нельзя построить корректную выборку.
 */
const hasDrillDownByParameter = (dataSet: AxisData | ComboData) => {
	const {attribute} = Array.isArray(dataSet.breakdown) ? dataSet.breakdown[0] : dataSet.parameters[0];
	return hasAttributeDrillDown(attribute);
};

/**
 * Определяет можно ли в данном Axis-виджете производить DrillDown
 * @param {AxisWidget} widget - виджет для проверки
 * @returns {boolean} - возвращает true, если по данному осевому виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному осевому виджету нельзя построить корректную выборку.
 */
const hasDrillDownAxisWidget = (widget: AxisWidget) => {
	const {data} = widget;
	const index = getMainDataSetIndex(widget.data);
	const dataSet = data[index];

	return hasDrillDownByParameter(dataSet);
};

/**
 * Определяет можно ли в данном Circle-виджете производить DrillDown
 * @param {CircleWidget} widget - Виджет
 * @returns {boolean} - возвращает true, если по данному круговому виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному круговому виджету нельзя построить корректную выборку.
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

const makeGeneratorAxisDrillDownOptions = (widget: AxisWidget): GetDrillDownOptions => {
	let result: GetDrillDownOptions;

	if (isMobile().any) {
		result = () => ({mode: 'disable'});
	} else {
		if (hasDrillDownAxisWidget(widget)) {
			result = (parameterValue: string, breakdownValue?: string): DrillDownOptions => {
				const mixin = createDrillDownMixin(widget);

				const index = getMainDataSetIndex(widget.data);
				const dataSet = widget.data[index];

				addIndicatorInfo(dataSet, mixin);
				addParameterFilter(dataSet, parameterValue, mixin);

				if (breakdownValue) {
					addBreakdownFilter(dataSet, breakdownValue, mixin);
				}

				return {index, mixin, mode: 'success'};
			};
		} else {
			result = () => ({mode: 'error'});
		}
	}

	return result;
};

const makeGeneratorCircleDrillDownOptions = (widget: CircleWidget): GetCircleDrillDownOptions => {
	let result: GetCircleDrillDownOptions;

	if (isMobile().any) {
		result = () => ({mode: 'disable'});
	} else {
		if (hasDrillDownCircleWidget(widget)) {
			result = (breakdownValue: string): DrillDownOptions => {
				const mixin = createDrillDownMixin(widget);

				const index = getMainDataSetIndex(widget.data);
				const dataSet = widget.data[index];

				addIndicatorInfo(dataSet, mixin);
				addBreakdownFilter(dataSet, breakdownValue, mixin);

				return {index, mixin, mode: 'success'};
			};
		} else {
			result = () => ({mode: 'error'});
		}
	}

	return result;
};

const makeGeneratorComboDrillDownOptions = (widget: ComboWidget): GetComboDrillDownOptions => {
	const handlers: {[dataKey: string]: (parameter: string, breakdown?: string) => DrillDownOptions} = {};

	widget.data.forEach((dataSet, index) => {
		if (!dataSet.sourceForCompute) {
			const dataKey = dataSet.dataKey;

			if (hasDrillDownByParameter(dataSet)) {
				handlers[dataKey] = (parameterValue: string, breakdownValue?: string) => {
					const mixin = createDrillDownMixin(widget);

					addIndicatorInfo(dataSet, mixin);
					addParameterFilter(dataSet, parameterValue, mixin);

					if (breakdownValue) {
						addBreakdownFilter(dataSet, breakdownValue, mixin);
					}

					return {index, mixin, mode: 'success'};
				};
			} else {
				handlers[dataKey] = () => ({mode: 'error'});
			}
		}
	});

	return (dataKey: string, parameter: string, breakdown?: string): DrillDownOptions => {
		let handlerResult = ({mode: 'disable'});

		if (!isMobile().any && handlers[dataKey]) {
			handlerResult = handlers[dataKey](parameter, breakdown);
		}

		return handlerResult;
	};
};

/**
 * Ищет индикатор по ключу в виджете сводной таблицы
 * @param {PivotWidget} widget - виджет сводной таблицы
 * @param {string} key - ключ индикатора
 * @returns {FoundPivotIndicatorInfo} - индекс и найденный индикатор
 */
const findIndicatorInfoInPivot = (widget: PivotWidget, key: string): FoundPivotIndicatorInfo => {
	let indicator = null;

	const index = widget.data.findIndex((dataSet, idx) => {
		indicator = dataSet.indicators.find(item => item.key === key);
		return indicator;
	});

	return {index, indicator};
};

/**
 * Добавляет индикатор в миксин дриллдауна сводной таблицы
 * @param {DrillDownMixin} mixin - миксин дриллдауна
 * @param {PivotIndicator} indicator - индикатор сводной таблицы
 * @returns {void}
 */
const addIndicatorToPivotMixin = (mixin: DrillDownMixin, indicator: PivotIndicator) => {
	const {aggregation, attribute: indicatorAttribute} = indicator;

	if (indicatorAttribute) {
		mixin.filters.push({aggregation, attribute: indicatorAttribute});
	}
};

/**
 * Добавляет параметры в миксин дриллдауна сводной таблицы
 *
 * @param {DrillDownMixin} mixin - миксин дриллдауна
 * @param {Array} parameters - список значений ключ параметра - значение
 * @param {Array} parametersMap - справочник информации о параметрах
 * @returns {void}
 */
const addParametersToPivotMixin = (
	mixin: DrillDownMixin,
	parameters: Array<{key: string, value: string}>,
	parametersMap: {[key: string]: Object}
): void => {
	parameters.forEach(filter => {
		const {attribute, descriptor, group} = parametersMap[filter.key] ?? {};

		if (attribute) {
			updateGroupFilter(mixin, {attribute, descriptor, group, value: filter.value});
		}
	});
};

/**
 * Добавляет разбивку индикатора в миксин дриллдауна сводной таблицы
 * @param {DrillDownMixin} mixin - миксин дриллдауна
 * @param {PivotIndicator} indicator - индикатор сводной таблицы
 * @param {string} breakdown - значение разбивки
 * @returns {void}
 */
const addBreakdownToPivotMixin = (mixin: DrillDownMixin, indicator: PivotIndicator, breakdown?: string): void => {
	if (indicator.breakdown && breakdown) {
		const {attribute, group} = indicator.breakdown;

		if (attribute) {
			updateGroupFilter(mixin, {attribute, group, value: breakdown});
		}
	}
};

/**
 * Формирует функцию-генератор параметров для запроса ссылки на дриллдаун для сводной таблицы
 * @param {PivotWidget} widget - виджет
 * @param {DiagramBuildData} rawData - сырые серверные данные
 * @returns {GetPivotDrillDownOptions} - функция-генератор запросов для дриллдауна
 */
const makeGeneratorPivotDrillDownOptions = (widget: PivotWidget, rawData: DiagramBuildData): GetPivotDrillDownOptions => {
	let result: GetPivotDrillDownOptions;

	if (isMobile().any) {
		result = () => ({mode: 'disable'});
	} else {
		const {columns} = rawData;
		const parametersSet = {};

		columns.filter(column => column.type === COLUMN_TYPES.PARAMETER).forEach(({accessor, attribute, descriptor, group}) => {
			parametersSet[accessor] = {attribute, descriptor, group};
		});

		result = (indicatorKey: string, filters: Array<{key: string, value: string}>, breakdown?: string) => {
			let mixinResult = {mode: 'error'};
			const lastParameter = filters[filters.length - 1];
			const {attribute} = parametersSet[lastParameter.key];

			if (hasAttributeDrillDown(attribute)) {
				const {index, indicator} = findIndicatorInfoInPivot(widget, indicatorKey);

				if (indicator) {
					const mixin = createDrillDownMixin(widget);

					addIndicatorToPivotMixin(mixin, indicator);
					addParametersToPivotMixin(mixin, filters, parametersSet);
					addBreakdownToPivotMixin(mixin, indicator, breakdown);

					mixinResult = {index, mixin, mode: 'success'};
				}
			}

			return mixinResult;
		};
	}

	return result;
};

export {
	addBreakdownFilter,
	addParameterFilter,
	makeGeneratorAxisDrillDownOptions,
	makeGeneratorCircleDrillDownOptions,
	makeGeneratorPivotDrillDownOptions,
	makeGeneratorComboDrillDownOptions,
	isNeedsClearedValue
};
