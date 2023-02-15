// @flow

// общие поля всех виджетов
const displayMode = 'displayMode';
const color = 'color';
const fontColor = 'fontColor';
const fontFamily = 'fontFamily';
const fontSize = 'fontSize';
const fontStyle = 'fontStyle';
const textAlign = 'textAlign';
const textHandler = 'textHandler';

const FIELDS = {
	color,
	displayMode,
	fontColor,
	fontFamily,
	fontSize,
	fontStyle,
	textAlign,
	textHandler
};

const additional = 'additional';
const labelFormat = 'labelFormat';
const notation = 'notation';
const quotient = 'quotient';
const remainder = 'remainder';
const splitDigits = 'splitDigits';
const symbolCount = 'symbolCount';

const AXIS_FORMAT_FIELDS = {
	additional,
	labelFormat,
	notation,
	quotient,
	remainder,
	splitDigits,
	symbolCount
};

// общие поля виджетов-диаграмм
const borders = 'borders';
const breakdown = 'breakdown';
const breakdownFormat = 'breakdownFormat';
const calcTotalColumn = 'calcTotalColumn';
const checked = 'checked';
const colorsSettings = 'colorsSettings';
const computedAttrs = 'computedAttrs';
const comparePeriod = 'comparePeriod';
const count = 'count';
const data = 'data';
const dataLabels = 'dataLabels';
const diagramName = 'diagramName';
const disabled = 'disabled';
const displayType = 'displayType';
const down = 'down';
const endDate = 'endDate';
const format = 'format';
const from = 'from';
const header = 'header';
const indicator = 'indicator';
const indicatorGrouping = 'indicatorGrouping';
const indicators = 'indicators';
const isNumber = 'isNumber';
const legend = 'legend';
const legendPosition = 'legendPosition';
const links = 'links';
const name = 'name';
const navigation = 'navigation';
const max = 'max';
const min = 'min';
const parameter = 'parameter';
const parameters = 'parameters';
const parametersOrder = 'parametersOrder';
const period = 'period';
const position = 'position';
const ranges = 'ranges';
const scale = 'scale';
const show = 'show';
const showBlankData = 'showBlankData';
const showDependent = 'showDependent';
const showEmptyData = 'showEmptyData';
const showName = 'showName';
const showShadow = 'showShadow';
const showSubTotalAmount = 'showSubTotalAmount';
const showTotalAmount = 'showTotalAmount';
const showTotalRowAmount = 'showTotalRowAmount';
const sorting = 'sorting';
const source = 'source';
const sources = 'sources';
const sourceForCompute = 'sourceForCompute';
const sourceRowName = 'sourceRowName';
const startDate = 'startDate';
const style = 'style';
const template = 'template';
const templateName = 'templateName';
const text = 'text';
const tip = 'tip';
const title = 'title';
const to = 'to';
const tooltip = 'tooltip';
const top = 'top';
const type = 'type';
const use = 'use';
const up = 'up';
const useName = 'useName';
const value = 'value';
const xAxisName = 'xAxisName';
const yAxisName = 'yAxisName';
const defaultValue = 'defaultValue';
const indicatorSettings = 'indicatorSettings';
const pageSize = 'pageSize';
const parameterSettings = 'parameterSettings';
const showRowNum = 'showRowNum';
const pivot = 'pivot';
const parameterRowColor = 'parameterRowColor';

const PIVOT_FIELDS = {
	defaultValue,
	indicatorSettings,
	pageSize,
	parameterRowColor,
	parameterSettings,
	pivot,
	showRowNum
};

const DIAGRAM_FIELDS = {
	...FIELDS,
	...AXIS_FORMAT_FIELDS,
	...PIVOT_FIELDS,
	borders,
	breakdown,
	breakdownFormat,
	calcTotalColumn,
	checked,
	colorsSettings,
	comparePeriod,
	computedAttrs,
	count,
	data,
	dataLabels,
	diagramName,
	disabled,
	displayType,
	down,
	endDate,
	format,
	from,
	header,
	indicator,
	indicatorGrouping,
	indicators,
	isNumber,
	legend,
	legendPosition,
	links,
	max,
	min,
	name,
	navigation,
	parameter,
	parameters,
	parametersOrder,
	period,
	position,
	ranges,
	scale,
	show,
	showBlankData,
	showDependent,
	showEmptyData,
	showName,
	showShadow,
	showSubTotalAmount,
	showTotalAmount,
	showTotalRowAmount,
	sorting,
	source,
	sourceForCompute,
	sourceRowName,
	sources,
	startDate,
	style,
	template,
	templateName,
	text,
	tip,
	title,
	to,
	tooltip,
	top,
	type,
	up,
	use,
	useName,
	value,
	xAxisName,
	yAxisName
};

export {
	AXIS_FORMAT_FIELDS,
	DIAGRAM_FIELDS,
	FIELDS
};
