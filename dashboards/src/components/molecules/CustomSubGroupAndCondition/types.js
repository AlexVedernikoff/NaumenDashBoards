// @flow
import type {AndCondition} from 'store/customGroups/types';
import type {GroupType} from 'store/widgets/data/types';

export type Props = {
	condition: AndCondition,
	disabled: boolean,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, data: AndCondition) => void,
	type: GroupType,
	validationPath: string
};
