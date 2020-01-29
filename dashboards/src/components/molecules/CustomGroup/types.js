// @flow
import type {CustomGroup, CustomGroupsMap, CustomGroupType} from 'store/customGroups/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	groups: CustomGroupsMap,
	onCreate: () => void,
	onRemove: () => void,
	onSelect: (groupId: string) => void,
	onUpdate: (group: CustomGroup) => void,
	selectedGroup: string,
	type: CustomGroupType | '',
	widgets: Array<Widget>
}

export type State = {
	showLimitInfo: boolean,
	showRemovalInfo: boolean,
	showUseInfo: boolean,
	usedInWidgets: []
}

export type InfoPanelProps = {
	onClose: () => void,
	onConfirm?: () => void,
	text: string
}
