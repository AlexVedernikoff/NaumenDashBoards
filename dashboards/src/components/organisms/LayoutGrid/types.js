// @flow
import type {ConnectedFunctions, ConnectedProps} from 'containers/LayoutGrid/types';
import type {Layout} from 'utils/layout/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type State = {
	newWidgetExists: boolean,
	showModal: boolean,
	widgetIdToRemove: string,
	width: number | null
};

export type Props = {
	editable: boolean,
	onLayoutChange?: (layout: Layout) => void,
	onRemoveWidget: (id: string) => void,
	onSelectWidget: (id: string) => void,
	selectedWidget: string,
	widgets: WidgetMap,
} & ConnectedProps & ConnectedFunctions;
