// @flow
import type {Condition} from 'store/customGroups/types';

export type Props = {
	data: Condition,
	isLast: boolean,
	onCreate: (condition: Condition) => void,
	onRemove: (condition: Condition, prevConditionId: string) => void,
	onUpdate: (condition: Condition) => void,
	prev: Condition | null
};
