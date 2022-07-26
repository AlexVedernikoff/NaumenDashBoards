// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {ParameterOrder} from 'store/widgetForms/types';

export type Props = {
	data: Array<DataSet>,
	onChange: (parameters: Array<ParameterOrder>) => void,
	value: Array<ParameterOrder>
};
