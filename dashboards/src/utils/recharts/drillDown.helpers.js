// @flow
/* eslint-disable no-unused-vars */
import type {
	AddFilterProps,
	DrillDownOptions,
	GetCircleDrillDownOptions,
	GetComboDrillDownOptions,
	GetDrillDownOptions
} from './types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {
	AxisData,
	AxisWidget,
	Chart,
	ChartDataSet,
	CircleData,
	CircleWidget,
	ComboData,
	ComboWidget,
	Group,
	MixedAttribute
} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {deepClone} from 'helpers';
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
 * @returns {DrillDownMixin}
 */
const addGroupFilter = (mixin: DrillDownMixin, props: AddFilterProps): DrillDownMixin => {
	const {attribute, group, value} = props;
	let newMixin = mixin;

	if (attribute && group) {
		newMixin = deepClone(mixin);
		const clearedValue = hasUUIDsInLabels(attribute, group) ? getSeparatedLabel(value) : value;

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
 * Добавляет в примесь данных данные индикатора
 *
 * @param {AxisData | CircleData} dataSet - набор данных виджета
 * @param {DrillDownMixin} mixin - примесь данных для перехода на список объектов
 * @returns {DrillDownMixin}
 */
const addIndicatorInfo = (dataSet: AxisData | CircleData, mixin: DrillDownMixin): DrillDownMixin => {
	const {aggregation, attribute} = dataSet.indicators[0];

	attribute && mixin.filters.push({aggregation, attribute});
	return mixin;
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
	return addGroupFilter(mixin, {attribute, group, value});
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

		newMixin = addGroupFilter(mixin, {attribute, group, value});
	}

	return newMixin;
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
		const isTimerValue = !!sourceAttribute.timerValue;

		return !isDateType && !isServiceCallEvt && !isTimerValue;
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

/**
 * Определяет можно ли в данном Combo-виджете производить DrillDown
 *
 * @param {ComboWidget} widget - виджет для проверки
 * @param {string} dataKey - идентификатор источника данных
 * @returns {boolean} - возвращает true, если по данному комбо-виджету данные в дриллдауне будут ожидаемыми
 * false - если по указанному комбо-виджету нельзя построить корректную выборку.
 */
const hasDrillDownComboWidget = (widget: ComboWidget, dataKey: string) => {
	const {data} = widget;
	const dataSet = data.find(dataSet => dataSet.dataKey === dataKey);

	return dataSet ? hasDrillDownByParameter(dataSet) : false;
};

const makeGeneratorAxisDrillDownOptions = (widget: AxisWidget): GetDrillDownOptions => {
	let result: GetDrillDownOptions;

	if (isMobile().any) {
		result = () => ({mode: 'disable'});
	} else {
		if (hasDrillDownAxisWidget(widget)) {
			result = (parameterValue: string, breakdownValue?: string): DrillDownOptions => {
				let mixin = createDrillDownMixin(widget);

				const index = getMainDataSetIndex(widget.data);
				const dataSet = widget.data[index];

				mixin = addIndicatorInfo(dataSet, mixin);
				mixin = addParameterFilter(dataSet, parameterValue, mixin);

				if (breakdownValue) {
					mixin = addBreakdownFilter(dataSet, breakdownValue, mixin);
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
				let mixin = createDrillDownMixin(widget);

				const index = getMainDataSetIndex(widget.data);
				const dataSet = widget.data[index];

				mixin = addIndicatorInfo(dataSet, mixin);
				mixin = addBreakdownFilter(dataSet, breakdownValue, mixin);

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
					let mixin = createDrillDownMixin(widget);

					mixin = addIndicatorInfo(dataSet, mixin);
					mixin = addParameterFilter(dataSet, parameterValue, mixin);

					if (breakdownValue) {
						mixin = addBreakdownFilter(dataSet, breakdownValue, mixin);
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

export {
	addBreakdownFilter,
	addParameterFilter,
	makeGeneratorAxisDrillDownOptions,
	makeGeneratorCircleDrillDownOptions,
	makeGeneratorComboDrillDownOptions,
	isNeedsClearedValue
};
