// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {AttributesDataState} from 'store/sources/attributesData/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {OrCondition} from 'store/customGroups/types';

export type Props = {
	attribute: Attribute,
	attributesData: AttributesDataState,
	condition: OrCondition,
	disabled: boolean,
	errors: ErrorsMap,
	fetchAttributesData: (attribute: Attribute, actual: boolean) => void,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, condition: OrCondition) => void,
	validationPath: string
};

export type State = {
	options: Array<Object>
};
