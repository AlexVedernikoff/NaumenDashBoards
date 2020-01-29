// @flow
import type {SubGroup} from 'store/customGroups/types';

export type Props = {
	data: SubGroup,
	isLast: boolean,
	onRemove: (subGroup: SubGroup, prevGroupId: string) => void,
	onUpdate: (subGroup: SubGroup) => void,
	prev: string
};
