// @flow
import type {DrillDown, OpenNavigationLink} from 'src/store/widgets/links/types';
import type {Props as ComponentProps} from 'components/organisms/DiagramWidget/components/ControlPanel/types';
import type {SaveWidgetWithNewFilters} from 'src/store/widgets/data/types';

export type ConnectedFunctions = {
	onDrillDown: DrillDown,
	onNavigation: OpenNavigationLink,
	onSaveWidgetWithNewFilters: SaveWidgetWithNewFilters
};

export type Props = ConnectedFunctions & ComponentProps;
