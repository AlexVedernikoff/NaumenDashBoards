// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup as StoreCustomGroup, OperandType} from 'store/customGroups/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {Node} from 'react';

export type OrCondition = Object;

export type AndCondition = Array<OrCondition>;

export type SubGroup = {
	data: Array<AndCondition>,
	name: string
};

export type CustomGroup = {
	id: string,
	name: string,
	subGroups: Array<SubGroup>,
	type: string
};

export type OnChangeOperandData = (condition: OrCondition) => void;

type RenderCondition = (condition: OrCondition, onChange: OnChangeOperandData) => Node | void;

type ResolveConditionRule = (condition: OrCondition) => Object | void;

type CreateCondition = (type?: OperandType) => Object;

type Option = {
	label: string,
	value: string
};

export type AttrCustomProps = {
	createCondition: CreateCondition,
	groups: Array<StoreCustomGroup>,
	options: Array<Option>,
	renderCondition: RenderCondition,
	resolveConditionRule: ResolveConditionRule
};

export type Props = {
	attribute: Attribute,
	className: string,
	group: Group,
	onCreate: CustomGroup => string,
	onRemove: (groupId: string) => void,
	onSubmit: Group => void,
	onUpdate: (group: CustomGroup, remote?: boolean) => void,
	show: boolean,
	widgets: Array<Widget>
} & AttrCustomProps;

export type ErrorsMap = {
	[string]: string
};

export type State = {
	errors: ErrorsMap,
	isSubmitting: boolean,
	selectedGroup: CustomGroup | null,
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
	options: Array<Object>,
	renderCondition: RenderCondition
};
