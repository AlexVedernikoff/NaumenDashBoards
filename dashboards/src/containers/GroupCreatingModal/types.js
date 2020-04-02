// @flow
import type {AttrCustomProps} from 'components/molecules/GroupCreatingModal/components/CustomGroup/types';
import type {AttrSystemProps} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup} from 'store/customGroups/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';

export type AttributeGroupProps = {
	attribute: Attribute,
	customGroups: Array<CustomGroup>,
	renderModal: (attrCustomProps: AttrCustomProps, attrSystemProps?: AttrSystemProps) => Node
};

export type ConnectedProps = {|
	customGroups: Array<CustomGroup>,
	widgets: Array<Widget>
|};

export type ConnectedFunctions = {|
	createCustomGroup: (group: CustomGroup) => ThunkAction,
	deleteCustomGroup: (id: string) => ThunkAction,
	updateCustomGroup: (group: CustomGroup, remote?: boolean) => ThunkAction
|};

export type ModalProps = {|
	attribute: Attribute,
	group: Group,
	onClose: () => void,
	onSubmit: (value: Group, attributeTitle: string) => void
|};

export type Props = {
	...ModalProps,
	...ConnectedProps,
	...ConnectedFunctions
};
