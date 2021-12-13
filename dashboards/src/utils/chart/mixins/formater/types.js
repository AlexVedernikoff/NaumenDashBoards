// @flow

export type CTXValue = Object;

export type NumberFormatter = (value: number) => string;

export type ValueFormatter = (value: string) => string;

export type ComboNumberFormatter = (value: number, ctx: Object) => string;

export type ComboValueFormatter = (value: string, ctx: Object) => string;

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
	tooltip: {
		data: NumberFormatter,
		title: ValueFormatter
	}
};

export type CircleFormatter = {
	breakdown: NumberFormatter | ValueFormatter,
	dataLabel: NumberFormatter,
	legend: NumberFormatter | ValueFormatter,
	tooltip: NumberFormatter,
};

export type ComboFormatter = {
	dataLabel: ComboNumberFormatter,
	indicator: ComboNumberFormatter,
	legend: {
		cropped: ComboNumberFormatter | ComboValueFormatter,
		full: ComboNumberFormatter | ComboValueFormatter,
	},
	options: FormatterParams,
	parameter: {
		default: ComboNumberFormatter | ComboValueFormatter,
		overlapped: ComboNumberFormatter | ComboValueFormatter
	},
};

export type TotalFormatter = {
	data: NumberFormatter
};

export type SpeedometerFormatter = {
	borders: NumberFormatter,
	ranges: NumberFormatter,
	total: NumberFormatter
};
