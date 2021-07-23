// @flow
import type {DiagramBuildData, DiagramData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	buildData: DiagramData,
	children: (data: DiagramBuildData) => React$Node,
	widget: Widget
};
