// @flow

export type NumberFormatter = (value: number) => string;

export type ValueFormatter = (value: string) => string;

export type FormatterParams = {
	hasOverlappedLabel: boolean,
	horizontal: boolean,
	stacked: boolean
};

export type AxisFormatter = {
	dataLabel: NumberFormatter,
	indicator: NumberFormatter,
	legend: NumberFormatter | ValueFormatter,
	options: FormatterParams,
	parameter: {
		default: NumberFormatter | ValueFormatter,
		overlapped: NumberFormatter | ValueFormatter
	},
};

export type CircleFormatter = {
	breakdown: NumberFormatter | ValueFormatter,
	dataLabel: NumberFormatter,
	legend: NumberFormatter | ValueFormatter,
	tooltip: NumberFormatter,
};
