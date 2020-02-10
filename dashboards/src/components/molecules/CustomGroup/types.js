// @flow
import type {CustomGroup, CustomGroupId, CustomGroupsMap, CustomGroupType} from 'store/customGroups/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	errors: ErrorsMap,
	getUsingWidgets: () => Array<Widget>,
	groups: CustomGroupsMap,
	onCreate: () => void,
	onRemove: () => void,
	onSelect: (CustomGroupId) => void,
	onUpdate: (group: CustomGroup) => void | Promise<void>,
	selectedGroup: CustomGroupId,
	type: CustomGroupType | ''
};

export type State = {
	showLimitInfo: boolean,
	showRemovalInfo: boolean,
	showUseInfo: boolean,
	usedInWidgets: []
};

export type InfoPanelProps = {
	onClose: () => void,
	onConfirm?: () => void,
	text: string
};
