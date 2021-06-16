// @flow
import type {AttributeColumn, BuildDataState, DataSetDescriptorRelation, DiagramBuildData} from './types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {COLUMN_TYPES, SEPARATOR} from './constants';
import {deepClone} from 'helpers';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {Row} from 'store/widgets/buildData/types';
import type {SourceData, Widget} from 'store/widgets/data/types';

/**
 * Возвращает значение представления без переданного кода
 * @param {string} value - значение представления
 * @param {string} separator - разделитель лейбла и кода
 * @returns {string}
 */
const getSeparatedLabel = (value: string, separator: string): string => value.split(separator)[0];

/**
 * Обновляем/сбрасываем данные по виджету при его редактировании
 *
 * @param   {BuildDataState}  state  - хранилище данных виджетов
 * @param   {Widget} widget - виджет для редактирования
 *
 * @returns  {BuildDataState} - новое хранилище данных виджетов
 */
const updateWidgetData = (state: BuildDataState, widget: Widget): BuildDataState => {
	const {id} = widget;

	if (id in state) {
		const data = state[id];

		if (data.type !== widget.type) {
			return {
				...state,
				[id]: {
					data: null,
					error: false,
					loading: false,
					type: widget.type
				}
			};
		}
	}

	return state;
};

/**
 * Получение расширеных дескрипторов для источника
 * @param {object} dataSet - источник
 * @returns  {Array<DataSetDescriptorRelation>} - расширеные дескрипторы
 */
const getDataSetFilterOptionsDescriptors = (dataSet: {dataKey: string, source: SourceData}): Array<DataSetDescriptorRelation> => {
	const {dataKey, source: {widgetFilterOptions}} = dataSet;
	const result = [];

	widgetFilterOptions && widgetFilterOptions.forEach(({descriptor}) => {
		if (descriptor) {
			result.push({dataKey, descriptor});
		}
	});

	return result;
};

/**
 * Получение расширенных дескрипторов для виджета
 * @param {Widget}  widget - Виджет
 * @returns  {Array<DataSetDescriptorRelation>} - расширеные дескрипторы
 */
const getWidgetFilterOptionsDescriptors = (widget: Widget): Array<DataSetDescriptorRelation> => {
	const {data} = widget;

	return data.map(getDataSetFilterOptionsDescriptors).flat();
};

/**
 * Сообщает о том, что текущая колонка содержит вычисленное значение для показателя
 * @param {AttributeColumn} column - колонка
 * @returns {boolean} - true - в данной колонке находится значение показателя, false - в данной колонке находится показатель или служебное значение
 */
const isIndicatorColumn = (column: AttributeColumn): boolean => {
	const {type} = column;
	const {BREAKDOWN, INDICATOR} = COLUMN_TYPES;

	return type === BREAKDOWN || type === INDICATOR;
};

/**
 * Сообщает о том, что в колонке содержатся значения, которые открываются как карточки объекта
 * @param {AttributeColumn} column - колонка
 * @returns {boolean} - true - открывать как карточки объекта, false - открывать как drillDown
 */
const isCardObjectColumn = (column: AttributeColumn): boolean => {
	let aggregation;

	if (column.type === COLUMN_TYPES.INDICATOR) {
		({aggregation} = column);
	}

	if (column.type === COLUMN_TYPES.BREAKDOWN) {
		({aggregation} = column.indicator);
	}

	return isIndicatorColumn(column) && aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE;
};

/**
 * Очищает коды из меток данных. Платформа для не сгруппированных значений возвращает:
 * <значение индикатора>#<код для построения карточки объекта>.
 * Для показа надо оставить только <значение индикатора>
 * @param {DiagramBuildData} data - данные для очистки
 * @returns {Array<Row>} - значения с очищенынми для пользователя данными
 */
const removeCodesFromRows = (data: DiagramBuildData): Array<Row> => {
	const {columns, data: originalRows} = data;
	const rows = deepClone(originalRows);

	columns.forEach(column => {
		const {accessor, attribute, type} = column;
		const isMetaClassParameterColumn = type === COLUMN_TYPES.PARAMETER && attribute.type === ATTRIBUTE_TYPES.metaClass;

		if (isMetaClassParameterColumn || isCardObjectColumn(column)) {
			rows.forEach(row => {
				const value = row[accessor];

				row[accessor] = typeof value === 'string' ? getSeparatedLabel(value, SEPARATOR) : value;
			});
		}
	});

	return rows;
};

export {
	getSeparatedLabel,
	getWidgetFilterOptionsDescriptors,
	isCardObjectColumn,
	isIndicatorColumn,
	removeCodesFromRows,
	updateWidgetData
};
