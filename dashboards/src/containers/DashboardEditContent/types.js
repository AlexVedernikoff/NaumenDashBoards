// @flow
import type {Layout} from 'types/layout';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'entities';

type EditLayout = (layout: Layout) => ThunkAction;

export type Props = {
	editedWidgetId: string,
	editLayout: EditLayout,
	editWidget: () => ThunkAction,
	widgets: Widget[]
}

export type ConnectedProps = {
	editedWidgetId: string,
	widgets: Widget[]
};

export type ConnectedFunctions = {
	editLayout: EditLayout,
	editWidget: (id: string) => ThunkAction
};
