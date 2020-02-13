// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {GroupType} from 'store/widgets/data/types';
import type {OrCondition} from 'store/customGroups/types';

export type Props = {
	attribute: Attribute,
	condition: OrCondition,
	disabled: boolean,
	errors: ErrorsMap,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, condition: OrCondition) => void,
	type: GroupType,
	validationPath: string
};

export type State = {
	options: Array<Object>
};
