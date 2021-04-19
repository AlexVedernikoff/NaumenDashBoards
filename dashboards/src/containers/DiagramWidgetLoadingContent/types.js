// @flow
import type {BuildData, DiagramBuildData, FetchBuildData} from 'store/widgets/buildData/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	fetchBuildData: FetchBuildData
};

export type ConnectedProps = {
	buildData: BuildData
};

export type Props = ConnectedProps & ConnectedFunctions & {
	children: (data: DiagramBuildData) => React$Node,
	widget: Widget
};
