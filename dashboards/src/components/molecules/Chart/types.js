// @flow
import type {Chart} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {Props as ContainerProps} from 'containers/Chart/types';

export type Props = {
	data: DiagramBuildData,
	widget: Chart,
	...ContainerProps
};
