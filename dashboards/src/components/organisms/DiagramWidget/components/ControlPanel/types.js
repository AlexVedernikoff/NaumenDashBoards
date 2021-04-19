// @flow
import type {DrillDown, OpenNavigationLink} from 'store/widgets/links/types';
import type {Props as WidgetPanelProps} from 'components/organisms/Widget/components/ControlPanel/types';
import type {Widget} from 'store/widgets/data/types';

export type OnClickMenuItemEvent = {
	item: {
		props: {
			keyEvent: any
		}
	},
	key: string
};

export type Props = {
	...WidgetPanelProps,
	exportOptions: Array<string>,
	onChangeFilter: (dataSetIndex: number, filterIndex: number, descriptor: string) => Promise<void>,
	onClearFilters: () => void,
	onDrillDown: DrillDown,
	onExport: (key: string) => Promise<void>,
	onNavigation: OpenNavigationLink,
	widget: Widget
};
