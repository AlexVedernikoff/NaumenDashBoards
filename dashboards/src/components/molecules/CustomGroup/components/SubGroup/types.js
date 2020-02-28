// @flow
import type {AndCondition} from 'components/molecules/CustomGroup/components/AndCondition/types';
import type {Attribute} from 'store/sources/attributes/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';

export type SubGroup = {
	data: Array<AndCondition>,
	name: string
};

export type Props = {
	attribute: Attribute,
	errors: ErrorsMap,
	index: number,
	isLast: boolean,
	onRemove: (index: number) => void,
	onUpdate: (index: number, subGroup: SubGroup) => void,
	subGroup: SubGroup,
	validationPath: string
};
