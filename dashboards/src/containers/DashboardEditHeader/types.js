// @flow
import type {LastPosition} from 'types/layout';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'entities';

type AddWidget = (lastPosition: LastPosition) => ThunkAction;

export type Props = {
	addWidget: AddWidget,
	widgets: Widget[]
}

export type ConnectedProps = {
	widgets: Widget[];
};

export type ConnectedFunctions = {
	addWidget: AddWidget
};
