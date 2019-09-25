// @flow
import type {ChartMap} from 'store/widgets/charts/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {
	charts: ChartMap,
	isEditable: boolean,
	widgets: WidgetMap
};

export type Props = ConnectedProps;
