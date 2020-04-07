// @flow
import type {CustomGroup as StoreCustomGroup, OperandType} from 'store/customGroups/types';
import type {Group, Widget} from 'store/widgets/data/types';
import type {Node} from 'react';
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

type CreateCondition = (type?: OperandType) => Object;

type Option = {
	label: string,
	value: string
};

export type AttrCustomProps = {|
	createCondition: CreateCondition,
	groups: Array<StoreCustomGroup>,
	options: Array<Option>,
	renderCondition: RenderCondition,
	resolveConditionRule: ResolveConditionRule,
	type: string,
	updateDate?: Date
|};

export type Props = {
	className: string,
	group: Group,
	onCreate: (customGroup: StoreCustomGroup, onCreateCallback: Function) => ThunkAction,
	onRemove: (groupId: string) => ThunkAction,
	onSubmit: Group => void,
	onUpdate: (customGroup: StoreCustomGroup, remote?: boolean) => ThunkAction,
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
	renderCondition: RenderCondition,
	updateDate: Date
};
