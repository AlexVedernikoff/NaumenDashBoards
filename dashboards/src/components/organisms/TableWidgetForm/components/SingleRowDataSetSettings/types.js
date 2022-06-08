// @flow
import type {Breakdown} from 'store/widgetForms/types';
import type {DataSet} from 'store/widgetForms/tableForm/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {FetchLinkedDataSources} from 'containers/TableDataSetSettings/types';
import type {FormBoxProps} from 'TableWidgetForm/components/IndicatorsBox/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';

export type IndicatorsFormBoxProps = FormBoxProps;

export type Components = {
	IndicatorsFormBox: React$ComponentType<IndicatorsFormBoxProps>
};

export type BreakdownContext = {
	breakdown: ?Breakdown,
	disableBreakdown: boolean
};

export type Props = {
	components: Components,
	disableBreakdown: boolean,
	fetchLinkedDataSources: FetchLinkedDataSources,
	index: number,
	isLast: boolean,
	isMain: boolean,
	linkedSources: LinkedDataSourceMap,
	onAdd: () => void,
	onChange: (index: number, value: DataSet, callback?: Function) => void,
	onChangeCalcTotalColumn: () => void,
	onRemove: (index: number) => void,
	sources: DataSourceMap,
	usesTotalAmount: boolean,
	value: DataSet
};
