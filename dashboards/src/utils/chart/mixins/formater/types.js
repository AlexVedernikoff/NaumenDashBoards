// @flow

export type NumberFormatter = (value: number) => string;

export type ValueFormatter = (value: string) => string;

export type FormatterParams = {
	hasOverlappedLabel: boolean,
	horizontal: boolean,
	stacked: boolean
};

export type Formatter = {
	dataLabel: NumberFormatter,
	indicator: NumberFormatter,
	legend: NumberFormatter | ValueFormatter,
	options: FormatterParams,
	parameter: {
		default: NumberFormatter | ValueFormatter,
		overlapped: NumberFormatter | ValueFormatter
	},
};
