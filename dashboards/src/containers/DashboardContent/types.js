// @flow
import type {BuildDataMap} from 'store/widgets/buildData/types';
import type {Layout} from 'utils/layout/types';
import type {NewWidget} from 'entities';
import type {Role} from 'store/dashboard/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: (widget: Widget, ordinalNumber?: number) => ThunkAction,
	editLayout: (layout: Layout) => ThunkAction,
	removeWidget: (id: string, onlyPersonal: boolean) => ThunkAction,
	selectWidget: (id: string) => ThunkAction
};

export type ConnectedProps = {
	buildData: BuildDataMap,
	editable: boolean,
	editMode: boolean,
	newWidget: NewWidget | null,
	selectedWidget: string,
	role?: Role,
	widgets: Array<Widget>
};

export type Props = ConnectedProps & ConnectedFunctions;
