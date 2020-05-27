// @flow
import type {AttrCustomProps} from 'components/molecules/GroupCreatingModal/components/CustomGroup/types';
import type {AttrSystemProps} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup, CustomGroupsMap} from 'store/customGroups/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {Item} from 'store/sources/currentObject/types';
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';

export type RenderModal = (attrCustomProps: AttrCustomProps, attrSystemProps?: AttrSystemProps) => Node;

export type FetchCurrentObjectAttributes = (parent: Item | null, attribute: Attribute) => ThunkAction;

export type AttributeGroupProps = {|
	attribute: Attribute,
	customGroups: Array<CustomGroup>,
	renderModal: RenderModal
|};

export type ConnectedProps = {|
	customGroups: CustomGroupsMap,
	widgets: Array<Widget>
|};

type onCreateCallback = (id: string) => void;

export type ConnectedFunctions = {|
	createCustomGroup: (group: CustomGroup, callback: onCreateCallback) => ThunkAction,
	deleteCustomGroup: (id: string) => ThunkAction,
	updateCustomGroup: (group: CustomGroup, remote?: boolean) => ThunkAction
|};

export type ModalProps = {|
	attribute: Attribute,
	group: Group,
	onClose: () => void,
	onSubmit: (value: Group, attributeTitle: string) => void
|};

export type Props = {|
	...ModalProps,
	...ConnectedProps,
	...ConnectedFunctions
|};
