// @flow
import type {SubGroup} from 'GroupModal/types';

export type Props = {
	index: number,
	isLast: boolean,
	onRemove: (index: number) => void,
	onUpdate: (index: number, subGroup: SubGroup, isNewCondition?: boolean) => void,
	subGroup: SubGroup,
	validationPath: string
};
