// @flow
import type {Breakdown, Indicator, Parameter, SourceData} from 'src/store/widgetForms/types';
import type {DataTopSettings, MixedAttribute} from 'src/store/widgets/data/types';

type DataSet = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters?: Array<Parameter>,
	showBlankData: boolean,
	showEmptyData: boolean,
	source: SourceData,
	top: DataTopSettings,
	...Object
};

export type IndicatorsFormBoxProps = {
	children: React$Node,
	title: string
};

export type BreakdownFieldsetProps = {
	dataKey: string,
	index: number,
	indicator: MixedAttribute | null,
	onChange: (value: Breakdown) => void,
	onRemove: () => void,
	removable: boolean,
	required: boolean,
	value: Breakdown
};

export type Components = {
	BreakdownFieldset: React$ComponentType<BreakdownFieldsetProps>,
	IndicatorsFormBox: React$ComponentType<IndicatorsFormBoxProps>
};

export type Props = {
	components: Components,
	index: number,
	onChange: (index: number, value: DataSet) => void,
	requiredBreakdown: boolean,
	usesBlankData: boolean,
	usesEmptyData: boolean,
	value: DataSet
};
