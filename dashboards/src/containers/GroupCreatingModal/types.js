// @flow
import type {AttrCustomProps} from 'components/molecules/GroupCreatingModal/components/CustomGroup/types';
import type {
	AttrSystemProps,
	Props as SystemProps
} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup, CustomGroupsMap, UpdateCustomGroup} from 'store/customGroups/types';
import type {Group, Source, Widget} from 'store/widgets/data/types';
import type {Item} from 'store/sources/currentObject/types';
import type {ThunkAction} from 'store/types';

export type RenderSystemGroup = (props: $Shape<SystemProps>) => React$Node;

export type AttrModalProps = {|
	customProps: AttrCustomProps,
	renderSystemGroup?: RenderSystemGroup,
	systemProps?: AttrSystemProps
|};

export type RenderModal = (props: AttrModalProps) => React$Node;

export type FetchCurrentObjectAttributes = (parent: Item | null, attribute: Attribute) => ThunkAction;

export type AttributeGroupProps = {|
	attribute: Attribute,
	customGroups: Array<CustomGroup>,
	renderModal: RenderModal,
	source: Source
|};

export type ConnectedProps = {|
	editableCustomGroups: CustomGroupsMap,
	originalCustomGroups: CustomGroupsMap,
	widgets: Array<Widget>
|};

type onCreateCallback = (id: string) => void;

export type ConnectedFunctions = {|
	createCustomGroup: (group: CustomGroup, callback: onCreateCallback) => ThunkAction,
	deleteCustomGroup: (id: string) => ThunkAction,
	updateCustomGroup: UpdateCustomGroup
|};

export type ModalProps = {|
	attribute: Attribute,
	group: Group,
	onClose: () => void,
	onSubmit: (value: Group, attributeTitle: string) => void,
	source: Source
|};

export type Props = {|
	...ModalProps,
	...ConnectedProps,
	...ConnectedFunctions
|};
