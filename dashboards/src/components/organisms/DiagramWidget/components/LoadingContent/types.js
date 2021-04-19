// @flow
import type {BuildData, DiagramBuildData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: BuildData,
	children: (data: DiagramBuildData) => React$Node,
	widget: Widget
};
