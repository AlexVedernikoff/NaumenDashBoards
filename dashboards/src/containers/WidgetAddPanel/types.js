// @flow
import type {NewWidget} from 'utils/widget';
import type {ThunkAction} from 'store/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {
	widgets: WidgetMap
};

export type ConnectedFunctions = {
	addWidget: (widget: NewWidget) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
