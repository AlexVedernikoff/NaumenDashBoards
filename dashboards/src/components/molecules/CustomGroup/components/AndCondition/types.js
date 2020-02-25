// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OrCondition} from 'components/molecules/CustomGroup/components/OrCondition/types';

export type AndCondition = Array<OrCondition>;

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
