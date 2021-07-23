// @flow
import type {DiagramBuildData, DiagramData, FetchBuildData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	fetchBuildData: FetchBuildData
};

export type ConnectedProps = {
	buildData: DiagramData
};

export type Props = ConnectedProps & ConnectedFunctions & {
	children: (data: DiagramBuildData) => React$Node,
	widget: Widget
};
