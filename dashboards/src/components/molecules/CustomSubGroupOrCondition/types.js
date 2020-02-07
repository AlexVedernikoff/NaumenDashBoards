// @flow
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {OrCondition} from 'store/customGroups/types';

export type Props = {
	condition: OrCondition,
	disabled: boolean,
	errors: ErrorsMap,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, condition: OrCondition) => void,
	validationPath: string
};
