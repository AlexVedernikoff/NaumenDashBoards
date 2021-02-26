// @flow
import type {DataSet, SourceData} from 'containers/DiagramWidgetEditForm/types';
import type {DataSourceMap} from 'store/sources/data/types';

export type Props = {
	computable: boolean,
	dataSet: DataSet,
	dataSetIndex: number,
	error: string,
	onChange: (dataSetIndex: number, source: SourceData) => void,
	onChangeForCompute: (dataSetIndex: number, value: boolean) => void,
	onFetchAttributes: (dataSetIndex: number, classFqn: string) => void,
	onFetchDynamicAttributes: (dataSetIndex: number, descriptor: string) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	sources: DataSourceMap,
	usesFilter: boolean,
	value: SourceData
};

export type State = {
	showForm: boolean,
	showList: boolean
};
