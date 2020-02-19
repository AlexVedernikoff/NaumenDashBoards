// @flow
import type {AndCondition} from 'store/customGroups/types';
import type {Attribute} from 'store/sources/attributes/types';

export type Props = {
	attribute: Attribute,
	condition: AndCondition,
	disabled: boolean,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, data: AndCondition) => void,
	validationPath: string
};
