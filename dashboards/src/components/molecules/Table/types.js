// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: DiagramBuildData,
	onUpdate: Widget => void,
	widget: Widget
};

export type State = {
	width: null | number
};
