// @flow
import type {Layout} from 'types/layout';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'entities';

type EditLayout = (layout: Layout) => ThunkAction;

export type Props = {
	editLayout: EditLayout;
	widgets: Widget[];
}

export type ConnectedProps = {
	widgets: Widget[];
};

export type ConnectedFunctions = {
	editLayout: EditLayout
};
