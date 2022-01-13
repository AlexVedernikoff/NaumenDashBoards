// @flow
import type {Parameter, SourceData} from 'store/widgetForms/types';

export type Props = {
	dataKey: string,
	index: number,
	onChange: (index: number, parameters: Array<Parameter>, callback?: Function) => void,
	source: SourceData,
	value: Array<Parameter>
};
