// @flow
import type {CustomGroup, CustomGroupId} from 'store/customGroups/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {GroupType, Widget} from 'store/widgets/data/types';

export type Props = {
	errors: ErrorsMap,
	getUsingWidgets: () => Array<Widget>,
	onCreate: () => void,
	onRemove: () => void,
	onSelect: (CustomGroupId) => void,
	onUpdate: (group: CustomGroup) => void | Promise<void>,
	options: Array<CustomGroup>,
	type: GroupType,
	value: CustomGroup | null
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
