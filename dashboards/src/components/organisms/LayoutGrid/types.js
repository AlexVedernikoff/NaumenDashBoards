// @flow
import type {ConnectedFunctions, ConnectedProps} from 'containers/LayoutGrid/types';
import type {Layout} from 'utils/layout/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type State = {
	width: number | null
};

export type Props = {
	editable: boolean,
	onLayoutChange?: (layout: Layout) => void,
	onWidgetSelect: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
	widgets: WidgetMap,
} & ConnectedProps & ConnectedFunctions;
