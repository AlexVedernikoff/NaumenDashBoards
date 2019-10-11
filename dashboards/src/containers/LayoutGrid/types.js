// @flow
import type {DiagramMap} from 'store/widgets/diagrams/types';
import type {GoOverMixin} from 'store/widgets/links/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	diagrams: DiagramMap
};

export type ConnectedFunctions = {
	goOver: (id: string, mixin: ?GoOverMixin) => ThunkAction,
};

export type Props = ConnectedProps & ConnectedFunctions;
