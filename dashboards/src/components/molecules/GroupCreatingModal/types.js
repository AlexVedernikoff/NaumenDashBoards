// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroupId, CustomGroupType} from 'store/customGroups/types';
import type {GroupType} from 'components/molecules/AttributeGroup/types';
import type {Props as ContainerProps} from 'containers/GroupCreatingModal/types';

export type GroupValue = {
	data: string,
	type: GroupType
};

export type ErrorsMap = {
	[string]: string
};

export type Props = {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: GroupValue, attributeTitle: string) => void,
	systemOptions: Array<Object>,
	value: GroupValue
} & ContainerProps;

export type State = {
	attributeTitle: string,
	customGroupType: CustomGroupType,
	errors: ErrorsMap,
	isSubmitting: boolean,
	selectedCustomGroup: CustomGroupId,
	showSaveInfo: boolean,
	systemValue: Object | null,
	type: GroupType
};
