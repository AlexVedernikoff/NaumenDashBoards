// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {Props as DiagramProps} from 'components/organisms/DiagramWidget/types';

export type Props = {
	...DiagramProps,
	children: (data: DiagramBuildData) => React$Node
};
