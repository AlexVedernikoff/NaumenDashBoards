// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroupId} from 'store/customGroups/types';
import type {GroupType, GroupWay} from 'store/widgets/data/types';
import type {Props as ContainerProps} from 'containers/GroupCreatingModal/types';

export type GroupValue = {
	data: string,
	way: GroupWay
};

export type ErrorsMap = {
	[string]: string
};

export type Props = {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: GroupValue, attributeTitle: string) => void,
	value: GroupValue
} & ContainerProps;

export type State = {
	attributeTitle: string,
	errors: ErrorsMap,
	isSubmitting: boolean,
	selectedCustomGroup: CustomGroupId,
	showSaveInfo: boolean,
	systemOptions: Array<Object>,
	systemValue: Object | null,
	type: GroupType,
	way: GroupWay
};

export type Context = {
	errors: ErrorsMap,
	type: GroupType
};
