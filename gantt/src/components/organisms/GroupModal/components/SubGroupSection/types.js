// @flow
import type {SubGroup} from 'GroupModal/types';

export type Props = {
	onUpdate: (subGroups: Array<SubGroup>, isNewCondition?: boolean) => void,
	subGroups: Array<SubGroup>
};
