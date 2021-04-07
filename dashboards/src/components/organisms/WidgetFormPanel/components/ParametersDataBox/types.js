// @flow
import type {Parameter, SourceData} from 'store/widgetForms/types';

export type DataSet = {
	dataKey: string,
	parameters: Array<Parameter>,
	source: SourceData
} & Object;

export type Props = {
	onChange: (data: Array<DataSet>) => void,
	onChangeParameters: (index: number, parameters: Array<Parameter>) => void,
	value: Array<DataSet>
};
