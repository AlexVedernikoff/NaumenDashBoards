// @flow
import type {DiagramMap} from 'store/widgets/diagrams/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {
	diagrams: DiagramMap,
	isEditable: boolean,
	widgets: WidgetMap
};

export type Props = ConnectedProps;
