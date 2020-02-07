// @flow
import type {AndCondition} from 'store/customGroups/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';

export type Props = {
	condition: AndCondition,
	disabled: boolean,
	errors: ErrorsMap,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, data: AndCondition) => void,
	validationPath: string
};
