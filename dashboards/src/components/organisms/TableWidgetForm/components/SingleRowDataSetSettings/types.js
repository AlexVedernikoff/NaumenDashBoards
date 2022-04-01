// @flow
import type {DataSet} from 'store/widgetForms/tableForm/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {FetchLinkedDataSources} from 'containers/TableDataSetSettings/types';
import type {FormBoxProps} from 'components/organisms/TableWidgetForm/components/IndicatorsBox/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';

export type IndicatorsFormBoxProps = FormBoxProps;

export type Components = {
	IndicatorsFormBox: React$ComponentType<IndicatorsFormBoxProps>
};

export type Props = {
	components: Components,
	fetchLinkedDataSources: FetchLinkedDataSources,
	index: number,
	isDifferentAggregations: boolean,
	isLast: boolean,
	isMain: boolean,
	linkedSources: LinkedDataSourceMap,
	onAdd: () => void,
	onChange: (index: number, value: DataSet, callback?: Function) => void,
	onRemove: (index: number) => void,
	sources: DataSourceMap,
	usesTotalAmount: boolean,
	value: DataSet
};
