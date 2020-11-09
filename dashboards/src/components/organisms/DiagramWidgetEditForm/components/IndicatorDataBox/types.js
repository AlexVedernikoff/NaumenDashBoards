// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';

export type Props = {
	...ContextProps,
	children: React$Node,
	index: number,
	name: string,
	renderLeftControl?: (set: DataSet, index: number) => React$Node,
	set: DataSet,
	usesBreakdown: boolean,
	usesEmptyData: boolean
};
