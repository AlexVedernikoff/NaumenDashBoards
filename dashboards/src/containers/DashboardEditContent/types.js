// @flow
import type {ChartMap} from 'store/widgets/charts/types';
import type {Layout} from 'types/layout';
import type {NewWidget} from 'entities';
import type {ThunkAction} from 'store/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	editLayout: (layout: Layout) => ThunkAction,
	selectWidget: (id: string) => ThunkAction
};

export type ConnectedProps = {
	charts: ChartMap,
	isEditable: boolean,
	newWidget: NewWidget | null,
	selectedWidget: string,
	widgets: WidgetMap
};

export type Props = ConnectedProps & ConnectedFunctions;
