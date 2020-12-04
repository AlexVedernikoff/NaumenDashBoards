// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';

export type Props = {
	...ContextProps,
	children: React$Node,
	dataSet: DataSet,
	index: number,
	name: string,
	onSelectCallback: (index: number) => Function,
	renderLeftControl?: (set: DataSet, index: number) => React$Node,
	usesBreakdown: boolean,
	usesEmptyData: boolean,
	usesTop: boolean
};
