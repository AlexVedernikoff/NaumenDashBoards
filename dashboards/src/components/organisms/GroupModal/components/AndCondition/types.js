// @flow
import type {AndCondition} from 'GroupModal/types';

export type Props = {
	disabled: boolean,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, data: AndCondition, isNewCondition?: boolean) => void,
	validationPath: string,
	value: AndCondition,
};
