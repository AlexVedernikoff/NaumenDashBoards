// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {DrillDown, OpenCardObject} from 'store/widgets/links/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: BuildData,
	onDrillDown: DrillDown,
	onOpenCardObject: OpenCardObject,
	onUpdate: Widget => void,
	widget: Widget
};

export type State = {
	nameRendered: boolean
};
