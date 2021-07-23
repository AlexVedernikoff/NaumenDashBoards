// @flow
import type {CustomGroup, ErrorsMap} from 'GroupModal/types';
import type {Schema} from 'components/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	loading: boolean,
	loadingOptions: boolean,
	onClearUnnamed: () => any,
	onCreate: (customGroup: CustomGroup) => Promise<string | null>,
	onFetchOptions: () => any,
	onRemove: (groupId: string, remote: boolean) => any,
	onSelect: (groupId: string) => void,
	onSubmit: (force: true) => void,
	onUpdate: (group: CustomGroup, remote?: boolean) => any,
	options: Array<CustomGroup>,
	schema: Schema | null,
	submitted: boolean,
	type: string,
	value: CustomGroup,
	widgets: Array<Widget>
};

export type State = {
	errors: ErrorsMap,
	showLimitInfo: boolean,
	showRemovalInfo: boolean,
	showSaveInfo: boolean,
	showUseInfo: boolean,
	usedInWidgets: Array<string>
};

export type InfoPanelProps = {
	onClose: () => void,
	onConfirm?: () => void,
	text: string
};
