// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: BuildData,
	onUpdate: Widget => void,
	widget: Widget
};
