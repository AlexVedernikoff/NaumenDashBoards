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
const symbolCount = 'symbolCount';
const splitDigits = 'splitDigits';

const LABEL_FORMAT_FIELDS = {
	additional,
	labelFormat,
	notation,
	splitDigits,
	symbolCount
};

// общие поля виджетов-диаграмм
const borders = 'borders';
const breakdown = 'breakdown';
const breakdownFormat = 'breakdownFormat';
const calcTotalColumn = 'calcTotalColumn';
const checked = 'checked';
const collapse = 'collapse';
const colorsSettings = 'colorsSettings';
const comparePeriod = 'comparePeriod';
const computedAttrs = 'computedAttrs';
const count = 'count';
const data = 'data';
const dataLabels = 'dataLabels';
const defaultValue = 'defaultValue';
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
const indicatorSettings = 'indicatorSettings';
const isNumber = 'isNumber';
const legend = 'legend';
const legendPosition = 'legendPosition';
const links = 'links';
const max = 'max';
const min = 'min';
const name = 'name';
const navigation = 'navigation';
const pageSize = 'pageSize';
const parameter = 'parameter';
const parameterRowColor = 'parameterRowColor';
const parameters = 'parameters';
const parameterSettings = 'parameterSettings';
const parametersOrder = 'parametersOrder';
const period = 'period';
const pivot = 'pivot';
const position = 'position';
const ranges = 'ranges';
const scale = 'scale';
const show = 'show';
const showBlankData = 'showBlankData';
const showDependent = 'showDependent';
const showEmptyData = 'showEmptyData';
const showName = 'showName';
const showRowNum = 'showRowNum';
const showShadow = 'showShadow';
const showSubTotalAmount = 'showSubTotalAmount';
const showTotalAmount = 'showTotalAmount';
const showTotalRowAmount = 'showTotalRowAmount';
const sorting = 'sorting';
const source = 'source';
const sourceForCompute = 'sourceForCompute';
const sourceRowName = 'sourceRowName';
const sources = 'sources';
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
const up = 'up';
const use = 'use';
const useName = 'useName';
const value = 'value';
const xAxisName = 'xAxisName';
const yAxisName = 'yAxisName';

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
	...LABEL_FORMAT_FIELDS,
	...PIVOT_FIELDS,
	borders,
	breakdown,
	breakdownFormat,
	calcTotalColumn,
	checked,
	collapse,
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
	DIAGRAM_FIELDS,
	FIELDS,
	LABEL_FORMAT_FIELDS
};
