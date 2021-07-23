// @flow
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	children: React$Node,
	widget: Widget
};

export type State = {
	headerHeight: number
};
