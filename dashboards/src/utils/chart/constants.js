// @flow
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

const DEFAULT_COLORS = [
	'#EA3223',
	'#999999',
	'#2C6FBA',
	'#4EAD5B',
	'#DE5D30',
	'#67369A',
	'#F6C142',
	'#4CAEEA',
	'#A1BA66',
	'#B02318',
	'#536130',
	'#DCA5A2',
	'#928A5B',
	'#9BB3D4',
	'#8C4A1C',
	'#FFFE55'
];

export {
	CHART_TYPES,
	DEFAULT_COLORS,
	LEGEND_POSITIONS
};
