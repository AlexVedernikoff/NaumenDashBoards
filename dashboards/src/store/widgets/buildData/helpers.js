// @flow
import type {AttributeColumn, BuildDataState, Column, DataSetDescriptorRelation, DiagramBuildData, WidgetDataError} from './types';
import {COLUMN_TYPES, SEPARATOR, TITLE_SEPARATOR} from './constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {IndicatorData} from 'store/widgets/buildData/types';
import type {SourceData, Widget} from 'store/widgets/data/types';

/**
 * Возвращает значение представления без переданного кода и uuid
 * @param {string} value - значение представления
 * @param {string} separator - разделитель лейбла и uuid
 * @param {string} titleSeparator - разделитель названия  и кода
 * @returns {string}
 */
const getSeparatedLabel = (
	value: string,
	separator: string = SEPARATOR,
	titleSeparator: string = TITLE_SEPARATOR
): string => {
	const titleWithCode = value.split(separator)[0];
	return titleWithCode.split(titleSeparator)[0];
};

/**
 * Обновляем/сбрасываем данные по виджету при его редактировании
 * @param {BuildDataState} state - хранилище данных виджетов
 * @param {Widget} widget - виджет для редактирования
 * @returns {BuildDataState} - новое хранилище данных виджетов
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
					error: null,
					loading: false,
					type: widget.type
				}
			};
		}
	}

	return state;
};

/**
 * Устанавливает ошибку загрузки данных в виджет
 * @param {BuildDataState} state - хранилище данных виджетов
 * @param {WidgetDataError} widgetDataError - запись о ошибке на виджете
 * @returns {BuildDataState} - новое хранилище данных виджетов
 */
const setWidgetError = (state: BuildDataState, widgetDataError: WidgetDataError): BuildDataState => {
	const {message, widgetId} = widgetDataError;
	return {
		...state,
		[widgetId]: {
			...state[widgetId],
			data: null,
			error: message,
			loading: false
		}
	};
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
 * Возвращает атрибут и агрегацию показателя для столбца
 * @param {AttributeColumn} column - колонка
 * @returns {IndicatorData} - данные показателя для конкретного столбца
 */
const getIndicatorAttribute = (column: AttributeColumn): IndicatorData | null => {
	let result = null;

	if (column.type === COLUMN_TYPES.INDICATOR) {
		const {aggregation, attribute} = column;

		result = {aggregation, attribute};
	} else if (column.type === COLUMN_TYPES.BREAKDOWN) {
		const {aggregation, attribute} = column.indicator;

		result = {aggregation, attribute};
	}

	return result;
};

/**
 * Проверяет, есть ли в таблице индикаторы с агрегацией
 * @param {Array<Column>} columns - столбцы таблицы
 * @returns  {boolean}
 */
const hasIndicatorsWithAggregation = (columns: Array<Column>): boolean =>
	columns.some(column =>
		column.type === COLUMN_TYPES.INDICATOR
		&& column.aggregation
		&& column.aggregation !== DEFAULT_AGGREGATION.NOT_APPLICABLE
	);

/**
 * Очищает коды из меток данных. Платформа для не сгруппированных значений возвращает:
 * <значение индикатора>#<код для построения карточки объекта>.
 * Для показа надо оставить только <значение индикатора>
 * @param {DiagramBuildData} tableData - данные для очистки
 * @returns {DiagramBuildData} - данные без кодов
 */
const removeCodesFromTableData = (tableData: DiagramBuildData): DiagramBuildData => {
	let {data} = tableData;

	const hasSeparator = value => typeof value === 'string' && value.includes(SEPARATOR);

	const removeCodeFromColumn = column => {
		const {accessor, columns, header} = column;
		const newHeader = hasSeparator(header) ? getSeparatedLabel(header) : header;
		const newColumns = columns?.map(removeCodeFromColumn);

		data = data.map(row => hasSeparator(row[accessor]) ? {...row, [accessor]: getSeparatedLabel(row[accessor])} : row);

		return {
			...column,
			columns: newColumns,
			header: newHeader
		};
	};

	const columns = tableData.columns.map(removeCodeFromColumn);

	return {
		...tableData,
		columns,
		data
	};
};

/**
 * Сообщает о том, что в колонке содержатся значения, которые агрегированы как PERCENT_CNT
 * @param {AttributeColumn} column - колонка
 * @returns {boolean} - true - агрегация как PERCENT_CNT, false - другая
 */
const isPercentCountColumn = (column: AttributeColumn): boolean => {
	let aggregation;

	if (column.type === COLUMN_TYPES.INDICATOR) {
		({aggregation} = column);
	}

	if (column.type === COLUMN_TYPES.BREAKDOWN) {
		({aggregation} = column.indicator);
	}

	return aggregation === DEFAULT_AGGREGATION.PERCENT_CNT;
};

/**
 * Преобразует значение PERCENT_CNT в понятный для пользователя вид
 * @param {string} value - значение PERCENT_CNT в формате `CNT PERCENT`
 * @returns {string}
 */
const parsePercentCountColumnValueForTable = (value: string): string => {
	let result = value;

	if (value !== '') {
		const values = value.split(' ');

		if (values.length === 2) {
			const [valStr, percentStr] = values;

			result = `${valStr} (${percentStr}%)`;
		}
	}

	return result;
};

export {
	getIndicatorAttribute,
	getSeparatedLabel,
	getWidgetFilterOptionsDescriptors,
	hasIndicatorsWithAggregation,
	isCardObjectColumn,
	isIndicatorColumn,
	isPercentCountColumn,
	parsePercentCountColumnValueForTable,
	removeCodesFromTableData,
	setWidgetError,
	updateWidgetData
};
