// @flow

export type CTXValue = Object;

export type PercentStore = {[storeId: string | null]: {[id: number]: number}};

export type NumberFormatter = (value: number, context?: CTXValue) => string;

export type StringFormatter = (value: string, context?: CTXValue) => string;

export type ValueFormatter = (value: string | number, context?: CTXValue) => string;

export type PivotValueFormatter = (value: string | number | [number, number] | null, context?: CTXValue) => string;

export type ValuePivotFormatter = (key: string, value: string | number | [number, number] | null, context?: CTXValue) => string;

export type ComboNumberFormatter = (dataKey: string) => (value: number, context?: CTXValue) => string;

export type ComboStringFormatter = (dataKey: string) => (value: string, context?: CTXValue) => string;

export type ComboValueFormatter = (dataKey: string) => (value: number | string, context?: CTXValue) => string;

export type FormatterParams = {
	hasOverlappedLabel: boolean,
	horizontal: boolean,
	stacked: boolean
};

export type AxisFormatter = {
	dataLabel: ValueFormatter,
	indicator: ValueFormatter,
	legend: ValueFormatter,
	parameter: ValueFormatter,
	tooltip: ValueFormatter,
	totalDataLabel: NumberFormatter
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
	data: NumberFormatter,
	diff: NumberFormatter
};

export type SpeedometerFormatter = {
	borders: NumberFormatter,
	ranges: NumberFormatter,
	total: NumberFormatter
};

export type PivotFormatter = {
	indicator: StringFormatter,
	parameter: StringFormatter,
	total: ValuePivotFormatter,
	value: ValuePivotFormatter
};
