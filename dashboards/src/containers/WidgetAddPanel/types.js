// @flow
import type {ThunkAction} from 'store/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {
	widgets: WidgetMap
};

export type ConnectedFunctions = {
	addWidget: (nextRow: number) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
