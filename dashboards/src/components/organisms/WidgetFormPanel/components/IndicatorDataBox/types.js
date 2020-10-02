// @flow
import type {ContextProps} from 'WidgetFormPanel/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';

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
