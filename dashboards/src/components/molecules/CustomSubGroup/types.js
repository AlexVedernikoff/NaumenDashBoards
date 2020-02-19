// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {SubGroup} from 'store/customGroups/types';

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
