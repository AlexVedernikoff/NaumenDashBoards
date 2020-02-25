// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ErrorsMap} from 'components/molecules/GroupCreatingModal/types';
import type {SubGroup} from 'components/molecules/CustomGroup/components/SubGroup/types';
import type {Widget} from 'store/widgets/data/types';

export type CustomGroup = {
	id: string,
	name: string,
	subGroups: Array<SubGroup>,
	type: string
};

export type Props = {
	attribute: Attribute,
	errors: ErrorsMap,
	getUsingWidgets: () => Array<Widget>,
	onCreate: () => void,
	onRemove: () => void,
	onSelect: (id: string) => void,
	onUpdate: (group: CustomGroup) => void | Promise<void>,
	options: Array<CustomGroup>,
	value: CustomGroup | null
};

export type State = {
	showLimitInfo: boolean,
	showRemovalInfo: boolean,
	showUseInfo: boolean,
	usedInWidgets: Array<string>
};

export type InfoPanelProps = {
	onClose: () => void,
	onConfirm?: () => void,
	text: string
};
