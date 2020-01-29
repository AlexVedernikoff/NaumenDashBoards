// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroupType} from 'store/customGroups/types';
import {GROUP_TYPES} from './constants';
import type {Props as ContainerProps} from 'containers/GroupCreatingModal/types';

export type GroupType = $Keys<typeof GROUP_TYPES>;

export type GroupValue = {
	data: string,
	type: GroupType
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
	selectedCustomGroup: string,
	showSaveInfo: boolean,
	systemValue: Object,
	type: GroupType
};
