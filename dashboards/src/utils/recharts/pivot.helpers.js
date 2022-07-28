// @flow
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {IndicatorGrouping, PivotWidget} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import type {
	ParseColumnsResult,
	PivotBreakdownInfo,
	PivotColumn,
	PivotColumnGroup,
	PivotColumnSum,
	PivotDataItem,
	PivotMetadata,
	PivotRawRow,
	PivotSeriesData
} from './types';
import {PIVOT_COLUMN_MIN_WIDTH, PIVOT_COLUMN_TYPE} from './constants';

/**
 * Создает группировку индикаторов по умолчанию из данных виджета
 * @param {PivotWidget} widget - виджет
 * @returns {IndicatorGrouping}
 */
const makeDefaultGrouping = (widget: PivotWidget): IndicatorGrouping => {
	const {data} = widget;
	const result = [];

	data.forEach(dataSet => {
		dataSet.indicators.forEach(({attribute, breakdown, key}) =>
			result.push({
				hasBreakdown: !!breakdown?.attribute,
				key,
				label: attribute?.title ?? '',
				type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
			})
		);
	});

	return result;
};

/**
 * Рассчитывает высоту шапки
 * @param {IndicatorGrouping} grouping - группировка индикаторов
 * @returns {number} - высота шапки
 */
const calcIndicatorGroupingTotalHeight = (grouping: IndicatorGrouping): number => {
	const heights = grouping.map(item => {
		let result = 1;

		if (item.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO && item.hasBreakdown) {
			result = 2;
		} else if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO && item.children) {
			result = calcIndicatorGroupingTotalHeight(item.children) + 1;
		}

		return result;
	});

	return Math.max(...heights);
};

/**
 * Преобразует IndicatorGrouping в дерево столбцов для отображения
 * @param {IndicatorGrouping} grouping - группировка индикаторов
 * @param {number} height - высота шапки
 * @param {PivotBreakdownInfo} breakdown - информация о разбивках
 * @returns {Array<PivotColumn>} - дерево столбцов для отображения
 */
const parseIndicatorGrouping2Columns = (
	grouping: IndicatorGrouping,
	height: number,
	breakdown: PivotBreakdownInfo
): Array<PivotColumn> => {
	const result = [];
	const isLastColumnGroup = false;

	grouping.forEach(item => {
		if (item.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
			const {hasBreakdown, key, label: title} = item;
			const isBreakdownColumn = hasBreakdown && breakdown[key] && breakdown[key].length > 0;

			if (isBreakdownColumn) {
				const breakdownColumns = breakdown[key];
				const children = breakdownColumns.map(({accessor: key, header: title}) => ({
					height: height - 1,
					isLastColumnGroup,
					key,
					title,
					type: PIVOT_COLUMN_TYPE.VALUE,
					width: 1
				}));

				children[children.length - 1].isLastColumnGroup = true;

				const group: PivotColumnGroup = {
					children,
					height: 1,
					isLastColumnGroup,
					key,
					title,
					type: PIVOT_COLUMN_TYPE.GROUP,
					width: children.length
				};

				result.push(group);
			} else {
				result.push({height, isLastColumnGroup, key, title, type: PIVOT_COLUMN_TYPE.VALUE, width: 1});
			}
		}

		if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
			const {hasSum, key, label: title} = item;

			if (item.children && item.children.length > 0) {
				const children = parseIndicatorGrouping2Columns(item.children, height - 1, breakdown);
				let width = children.reduce((p, {width}) => p + width, 0);

				if (hasSum) {
					const sumKeys = children.map(c => c.key);
					const column: PivotColumnSum = {
						height: height - 1,
						isLastColumnGroup,
						key: '∑::' + key,
						sumKeys,
						title: '',
						type: PIVOT_COLUMN_TYPE.SUM,
						width: 1
					};

					children.push(column);
					width++;
				}

				const group: PivotColumnGroup = {
					children,
					height: 1,
					isLastColumnGroup,
					key,
					title,
					type: PIVOT_COLUMN_TYPE.GROUP,
					width
				};

				result.push(group);
			} else {
				result.push({height, isLastColumnGroup, key, title, type: PIVOT_COLUMN_TYPE.EMPTY_GROUP, width: 1});
			}
		}
	});
	return result;
};

/**
 * Формирует ячейку параметра по умолчанию
 * @param {number} height - высота шапки
 * @returns {PivotColumn} - ячейка параметра по умолчанию
 */
const makeParameterCell = (height: number): PivotColumn => ({
	height,
	isLastColumnGroup: false,
	key: 'parameter',
	title: '',
	type: PIVOT_COLUMN_TYPE.PARAMETER,
	width: 1
});

/**
 * Рассчитывает дерево столбцов и высоту шапки
 * @param {PivotWidget} widget - информация о виджете
 * @param {DiagramBuildData} rawData - сырые данные виджета
 * @param {PivotBreakdownInfo} breakdown - информация о разбивках
 * @returns {ParseColumnsResult}
 */
export const parseColumns = (
	widget: PivotWidget,
	rawData: DiagramBuildData,
	breakdown: PivotBreakdownInfo
): ParseColumnsResult => {
	let {indicatorGrouping} = widget;

	if (!indicatorGrouping) {
		indicatorGrouping = makeDefaultGrouping(widget);
	}

	const totalHeight = calcIndicatorGroupingTotalHeight(indicatorGrouping);
	const columns = [
		makeParameterCell(totalHeight),
		...parseIndicatorGrouping2Columns(indicatorGrouping, totalHeight, breakdown)
	];

	return {columns, totalHeight};
};

/**
 * Формирует список столбцов нижнего уровня для отображения данных
 * @param {Array<PivotColumn>} columns - дерево столбцов
 * @returns {Array<PivotColumn>} - столбцы нижнего уровня
 */
export const parseColumnsFlat = (columns: Array<PivotColumn>): Array<PivotColumn> => {
	const result = [];

	columns.forEach(column => {
		if (column.type === PIVOT_COLUMN_TYPE.GROUP) {
			const subColumns = parseColumnsFlat(column.children);

			const subColumnsLast = {...subColumns.pop(), isLastColumnGroup: true};

			subColumns.push(subColumnsLast);
			subColumns.forEach(subColumn => result.push(subColumn));
		} else {
			result.push(column);
		}
	});

	return result;
};

/**
 * Формирует ширину столбцов по умолчанию
 * @param {Array<PivotColumn>} columns - список столбцов
 * @param {HTMLDivElement} container - контейнер
 * @returns {number} - ширина столбцов по умолчанию
 */
export const getColumnWidth = (columns: Array<PivotColumn>, container: HTMLDivElement): number => {
	const {width: containerWidth} = container.getBoundingClientRect();
	return Math.max((containerWidth - 9) / (columns.length + 1), PIVOT_COLUMN_MIN_WIDTH);
};

/**
 * Формирует список параметров для сводной таблицы
 * @param {DiagramBuildData} rawData - сырые серверные данные
 * @returns {Array<string>} - список ключей параметров
 */
export const getParametersColumns = (rawData: DiagramBuildData): Array<string> => {
	const {columns} = rawData;
	return columns.filter(({type}) => type === COLUMN_TYPES.PARAMETER).map(({accessor}) => accessor);
};

/**
 * Формирует список показателей для сводной таблицы
 * @param {DiagramBuildData} rawData - сырые серверные данные
 * @returns {Array<string>} - список ключей показателей
 */
export const getIndicatorsColumns = (rawData: DiagramBuildData): Array<string> => {
	const {columns} = rawData;
	return columns.filter(({type}) => type === COLUMN_TYPES.INDICATOR).map(({accessor}) => accessor);
};

/**
 * Формирует метаданные по разбивкам показателей для сводной таблицы
 * @param {DiagramBuildData} rawData - сырые серверные данные
 * @returns {PivotMetadata} - метаданные по разбивке
 */
export const getBreakdown = (rawData: DiagramBuildData): PivotBreakdownInfo => {
	const {columns} = rawData;
	const breakdown = {};

	columns.filter(({columns, type}) => type === COLUMN_TYPES.INDICATOR && columns).forEach(column => {
		breakdown[column.accessor] = column.columns?.map(({accessor, header}) => ({accessor, header}));
	});

	return breakdown;
};

/**
 * Формирует метаданные для сводной таблицы
 * @param {DiagramBuildData} rawData - сырые серверные данные
 * @returns {PivotMetadata} - метаданные для сводной таблицы
 */
export const parseMetadata = (rawData: DiagramBuildData): PivotMetadata => ({
	breakdown: getBreakdown(rawData),
	dataColumns: getIndicatorsColumns(rawData),
	parameters: getParametersColumns(rawData)
});

export const addPivotData = (
	data?: number | [number, number] | null,
	add: number | [number, number]
): number | [number, number] | void => {
	let result;

	if (!data) {
		result = add;
	} else {
		if (Array.isArray(data) && data.length === 2) {
			if (Array.isArray(add) && add.length === 2) {
				result = [data[0] + add[0], data[1] + add[1]];
			} else if (typeof add === 'number') {
				result = [data[0] + add, data[1]];
			}
		} else {
			if (Array.isArray(add) && add.length === 2) {
				result = [data + add[0], add[1]];
			} else if (typeof add === 'number') {
				result = data + add;
			}
		}
	}

	return result;
};

/**
 * Рассчитывает итоговые данные по столбцам
 * @param {PivotSeriesData} children - дочерние строки
 * @param {Array<string>} columns - список столбцов
 * @returns {PivotDataItem} - итоговые данные
 */
const calculateTotals = (children: PivotSeriesData, columns: Array<string>): PivotDataItem => {
	const result = {};

	children.forEach(row => {
		columns.forEach(column => {
			const add = row.data[column];

			if (add !== null && add !== undefined) {
				result[column] = addPivotData(result[column], add);
			}
		});
	});

	return result;
};

/**
 * Очищает строки сырых данных по списку столбцов
 * @param {Array<PivotRawRow>} subData - сырые данные
 * @param { Array<string>} columns - список столбцов
 * @returns {PivotDataItem} - очищенные строки
 */
const parseRawData = (subData: Array<PivotRawRow>, columns: Array<string>): PivotDataItem => {
	const result = {};

	if (subData && subData.length > 0) {
		const row = subData[0];

		columns.forEach(column => {
			const rawValue = row[column];

			if (typeof rawValue === 'string') {
				if (rawValue.indexOf(' ') !== -1) {
					const [cnt, percent] = rawValue.split(' ');
					const cntVal = parseFloat(cnt);
					const percentVal = parseFloat(percent);

					result[column] = !isNaN(cntVal) && !isNaN(percentVal) ? [cntVal, percentVal] : null;
				} else {
					const value = parseFloat(rawValue);

					result[column] = isNaN(value) ? null : value;
				}
			} else if (typeof rawValue === 'number') {
				result[column] = rawValue;
			}
		});
	}

	return result;
};

/**
 * Группирует данные по параметрам
 * @param {Array<PivotRawRow>} data - сырые данные с сервера
 * @param {Array<string>} parameters - список ключей параметров
 * @param {Array<string>} dataColumns - список ключей столбцов
 * @returns {PivotSeriesData} - очищенные данные, сгруппированные по параметру
 */
const groupDataFromParameters = (
	data: Array<PivotRawRow>,
	parameters: Array<string>,
	dataColumns: Array<string>
): PivotSeriesData => {
	const result = [];

	if (parameters.length > 0) {
		const [key, ...tailParameters] = parameters;
		const values = new Set(data.map(row => row[key]));

		values.forEach(value => {
			const subData = data.filter(row => row[key] === value);
			const children = groupDataFromParameters(subData, tailParameters, dataColumns);

			if (tailParameters.length === 0 || children.length === 0) {
				result.push({
					data: parseRawData(subData, dataColumns),
					key,
					value: String(value)
				});
			} else {
				result.push({
					children,
					data: calculateTotals(children, dataColumns),
					key,
					value: String(value)
				});
			}
		});
	}

	return result;
};

/**
 * Формирует древовидные данные для сводной таблицы
 * @param {DiagramBuildData} rawData - данные с сервера
 * @param {PivotMetadata} metadata - метаданные сводной таблицы
 * @returns {PivotSeriesData}
 */
export const getSeriesData = (rawData: DiagramBuildData, metadata: PivotMetadata): PivotSeriesData => {
	const {data} = rawData;
	const {breakdown, dataColumns, parameters} = metadata;
	const columns = [...dataColumns];

	dataColumns.forEach(column => {
		const subColumns = breakdown[column];

		if (subColumns) {
			subColumns.forEach(({accessor}) => columns.push(accessor));
		}
	});

	const result = groupDataFromParameters(data, parameters, columns);

	return result;
};
