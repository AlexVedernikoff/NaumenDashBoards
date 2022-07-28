// @flow
import type {DiagramDataSet} from 'store/widgetForms/types';
import {FIELD_TYPE} from './constants';
import type {MixedAttribute} from 'store/widgets/data/types';

export type Props = {
	children: React$Node,
	className: string,
	dataSetIndex: number,
	dataSets: Array<DiagramDataSet>,
	fieldType: $Keys<typeof FIELD_TYPE>,
	onChangeDataSet: (dataSetIndex: number, dataSet: DiagramDataSet) => void,
	value: ?MixedAttribute,
};
