// @flow

export type CTXValue = Object;

export type PercentStore = {[id: number]: number};

export type NumberFormatter = (value: number) => string;

export type StringFormatter = (value: string) => string;

export type ValueFormatter = (value: string | number) => string;

export type ComboNumberFormatter = (dataKey: string) => (value: number) => string;

export type ComboStringFormatter = (dataKey: string) => (value: string) => string;

export type ComboValueFormatter = (dataKey: string) => (value: number | string) => string;

export type FormatterParams = {
	hasOverlappedLabel: boolean,
	horizontal: boolean,
	stacked: boolean
};

export type AxisFormatter = {
	dataLabel: NumberFormatter,
	indicator: NumberFormatter,
	legend: ValueFormatter,
	parameter: ValueFormatter,
	tooltip: ValueFormatter
};

export type CircleFormatter = {
	category: ValueFormatter,
	label: NumberFormatter,
};

export type ComboFormatter = {
	dataLabel: ComboNumberFormatter,
	indicator: ComboNumberFormatter,
	legend: ComboValueFormatter,
	parameter: ValueFormatter,
};

export type TotalFormatter = {
	data: NumberFormatter
};

export type SpeedometerFormatter = {
	borders: NumberFormatter,
	ranges: NumberFormatter,
	total: NumberFormatter
};
