// @flow
import type {Borders} from 'src/store/widgets/data/types';
import type {DataSet} from 'store/widgetForms/speedometerForm/types';

export type Props = {
	dataSet: ?DataSet,
	name: string,
	onChange: (name: string, value: Borders) => void,
	value: Borders
};
