// @flow
import type {LayoutMode} from 'store/dashboard/settings/types';
import type NewWidget from 'store/widgets/data/NewWidget';
import type {ThunkAction} from 'store/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {
	layoutMode: LayoutMode,
	widgets: WidgetMap
};

export type ConnectedFunctions = {
	addWidget: (widget: NewWidget) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
