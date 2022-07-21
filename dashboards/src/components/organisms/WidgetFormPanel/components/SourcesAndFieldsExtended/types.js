// @flow
import type {DiagramDataSet} from 'store/widgetForms/types';
import type {MixedAttribute} from 'store/widgets/data/types';

export type Props = {
	children: React$Node,
	className: string,
	dataSetIndex: number,
	dataSets: Array<DiagramDataSet>,
	onChangeDataSet: (dataSetIndex: number, dataSet: DiagramDataSet) => void,
	value: ?MixedAttribute,
};
