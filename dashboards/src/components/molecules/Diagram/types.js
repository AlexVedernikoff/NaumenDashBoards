// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {DrillDown} from 'store/widgets/links/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: BuildData,
	focused: boolean,
	onDrillDown: DrillDown,
	onUpdate: Widget => void,
	widget: Widget
};

export type State = {
	nameRendered: boolean
};
