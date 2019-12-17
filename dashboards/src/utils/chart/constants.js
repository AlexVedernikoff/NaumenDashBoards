// @flow
const BAR: 'BAR' = 'BAR';
const BAR_STACKED: 'BAR_STACKED' = 'BAR_STACKED';
const COLUMN: 'COLUMN' = 'COLUMN';
const COLUMN_STACKED: 'COLUMN_STACKED' = 'COLUMN_STACKED';
const DONUT: 'DONUT' = 'DONUT';
const LINE: 'LINE' = 'LINE';
const PIE: 'PIE' = 'PIE';
const COMBO: 'COMBO' = 'COMBO';

const CHART_VARIANTS = {
	BAR,
	BAR_STACKED,
	COLUMN,
	COLUMN_STACKED,
	COMBO,
	DONUT,
	LINE,
	PIE
};

const bar: 'bar' = 'bar';
const donut: 'donut' = 'donut';
const line: 'line' = 'line';
const pie: 'pie' = 'pie';

const CHART_TYPES = {
	bar,
	donut,
	line,
	pie
};

const bottom: 'bottom' = 'bottom';
const left: 'left' = 'left';
const right: 'right' = 'right';
const top: 'top' = 'top';

const LEGEND_POSITIONS = {
	bottom,
	left,
	right,
	top
};

export {
	CHART_TYPES,
	CHART_VARIANTS,
	LEGEND_POSITIONS
};
