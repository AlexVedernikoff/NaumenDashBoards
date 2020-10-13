// @flow
import type {AndCondition, ContextProps} from 'CustomGroup/types';
import type {Attribute} from 'store/sources/attributes/types';

export type Props = {
	...ContextProps,
	attribute: Attribute,
	condition: AndCondition,
	disabled: boolean,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, data: AndCondition, isNewCondition?: boolean) => void,
	validationPath: string
};
