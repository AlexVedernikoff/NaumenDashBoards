// @flow
import type {CustomGroup, ErrorsMap} from 'GroupModal/types';
import type {Schema} from 'containers/WidgetEditForm/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	loading: boolean,
	onCreate: (customGroup: CustomGroup) => Promise<string | null>,
	onFetch: () => any,
	onRemove: (groupId: string, remote: boolean) => any,
	onSelect: (groupId: string) => void,
	onSubmit: (force: true) => void,
	onUpdate: (group: CustomGroup, remote?: boolean) => any,
	options: Array<CustomGroup>,
	schema: Schema | null,
	submitted: boolean,
	type: string,
	value: string,
	widgets: Array<Widget>
};

export type State = {
	errors: ErrorsMap,
	showLimitInfo: boolean,
	showRemovalInfo: boolean,
	showSaveInfo: boolean,
	showUseInfo: boolean,
	usedInWidgets: Array<string>,
	value: CustomGroup | null
};

export type InfoPanelProps = {
	onClose: () => void,
	onConfirm?: () => void,
	text: string
};
