// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: BuildData,
	focused: boolean,
	onUpdate: Widget => void,
	widget: Widget
};

export type State = {
	nameRendered: boolean
};
