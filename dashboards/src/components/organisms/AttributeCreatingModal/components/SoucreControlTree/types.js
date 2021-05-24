// @flow
import type {Props as TreeProps} from 'components/molecules/TreeSelect/components/Tree/types';
import type {Tree} from 'components/molecules/TreeSelect/types';

export type Props = TreeProps & {
	onAddConstant: () => void,
	originalOptions: Tree
};
