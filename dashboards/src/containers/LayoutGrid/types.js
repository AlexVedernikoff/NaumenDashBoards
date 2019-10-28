// @flow
import type {DiagramMap} from 'store/widgets/diagrams/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	diagrams: DiagramMap
};

export type ConnectedFunctions = {
	comboDrillDown: (widget: Widget, orderNum: number) => ThunkAction,
	drillDown: (widget: Widget, mixin: ?DrillDownMixin) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
