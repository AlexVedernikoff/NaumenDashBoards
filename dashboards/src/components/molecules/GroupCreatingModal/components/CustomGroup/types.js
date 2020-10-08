// @flow
import type {
	CustomGroup as StoreCustomGroup,
	CustomGroupsMap,
	OperandType,
	UpdateCustomGroup
} from 'store/customGroups/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {Node} from 'react';
import type {SetSubmit} from 'components/molecules/GroupCreatingModal/types';
import type {ThunkAction} from 'store/types';

export type OrCondition = Object;

export type AndCondition = Array<OrCondition>;

export type SubGroup = {
	data: Array<AndCondition>,
	name: string
};

export type CustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<SubGroup>,
	type: any
|};

export type OnChangeOperand = (condition: OrCondition) => void;

type RenderCondition = (condition: OrCondition, onChange: OnChangeOperand) => Node | void;

type ResolveConditionRule = (condition: OrCondition) => Object | void;

type CreateCondition = (type?: OperandType, condition?: OrCondition) => Object;

type Option = {
	label: string,
	value: string
};

export type AttrCustomProps = {|
	createCondition: CreateCondition,
	getErrorKey?: (key: string) => string,
	groups: Array<StoreCustomGroup>,
	operandData?: Object,
	options: Array<Option>,
	renderCondition: RenderCondition,
	resolveConditionRule: ResolveConditionRule,
	type: string,
|};

export type Props = {
	editableGroups: CustomGroupsMap,
	group: Group,
	onCreate: (customGroup: StoreCustomGroup, onCreateCallback: Function) => ThunkAction,
	onRemove: (groupId: string) => ThunkAction,
	onSubmit: Group => void,
	onUpdate: UpdateCustomGroup,
	originalGroups: CustomGroupsMap,
	setSubmit: SetSubmit,
	show: boolean,
	widgets: Array<Widget>,
	...AttrCustomProps
};

export type ErrorsMap = {
	[string]: string
};

export type State = {
	errors: ErrorsMap,
	isSubmitting: boolean,
	selectedGroup: string,
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

export type ContextProps = {
	createCondition: CreateCondition,
	errors: ErrorsMap,
	getErrorKey?: (key: string) => string,
	operandData?: Object,
	options: Array<Object>,
	renderCondition: RenderCondition
};
