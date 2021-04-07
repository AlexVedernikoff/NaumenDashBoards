// @flow
import type {Breakdown, Indicator, Parameter, SourceData} from 'src/store/widgetForms/types';
import type {DataTopSettings} from 'src/store/widgets/data/types';

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

export type Components = {
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
