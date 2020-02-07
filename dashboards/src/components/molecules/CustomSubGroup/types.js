// @flow
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {SubGroup} from 'store/customGroups/types';

export type Props = {
	errors: ErrorsMap,
	index: number,
	isLast: boolean,
	onRemove: (index: number) => void,
	onUpdate: (index: number, subGroup: SubGroup) => void,
	subGroup: SubGroup,
	validationPath: string
};
