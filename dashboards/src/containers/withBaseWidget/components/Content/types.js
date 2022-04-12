// @flow
import type {DivRef} from 'components/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	children: React$Node,
	forwardedRef?: DivRef,
	widget: Widget,
};

export type State = {
	headerHeight: number
};
