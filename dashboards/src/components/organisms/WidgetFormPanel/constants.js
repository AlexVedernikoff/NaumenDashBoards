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
const colorsSettings = 'colorsSettings';
const computedAttrs = 'computedAttrs';
const count = 'count';
const data = 'data';
const dataLabels = 'dataLabels';
const diagramName = 'diagramName';
const disabled = 'disabled';
const displayType = 'displayType';
const format = 'format';
const from = 'from';
const header = 'header';
const indicator = 'indicator';
const indicators = 'indicators';
const isNumber = 'isNumber';
const legend = 'legend';
const legendPosition = 'legendPosition';
const name = 'name';
const navigation = 'navigation';
const max = 'max';
const min = 'min';
const parameter = 'parameter';
const parameters = 'parameters';
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
const sorting = 'sorting';
const source = 'source';
const sources = 'sources';
const sourceForCompute = 'sourceForCompute';
const sourceRowName = 'sourceRowName';
const style = 'style';
const template = 'template';
const templateName = 'templateName';
const tip = 'tip';
const title = 'title';
const to = 'to';
const tooltip = 'tooltip';
const top = 'top';
const type = 'type';
const use = 'use';
const useName = 'useName';
const value = 'value';
const xAxisName = 'xAxisName';
const yAxisName = 'yAxisName';

const DIAGRAM_FIELDS = {
	...FIELDS,
	...LABEL_FORMAT_FIELDS,
	borders,
	breakdown,
	breakdownFormat,
	calcTotalColumn,
	colorsSettings,
	computedAttrs,
	count,
	data,
	dataLabels,
	diagramName,
	disabled,
	displayType,
	format,
	from,
	header,
	indicator,
	indicators,
	isNumber,
	legend,
	legendPosition,
	max,
	min,
	name,
	navigation,
	parameter,
	parameters,
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
	sorting,
	source,
	sourceForCompute,
	sourceRowName,
	sources,
	style,
	template,
	templateName,
	tip,
	title,
	to,
	tooltip,
	top,
	type,
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
