// @flow
import type {Attribute} from 'store/sources/attributes/types';
import CustomGroupComponent from './components/CustomGroup';
import type {Group, GroupWay} from 'store/widgets/data/types';
import type {LangType} from 'localization/localize_types';
import type {Props as SystemPropsProps} from './components/SystemGroup/types';
import type {Ref, Schema} from 'components/types';

export type ErrorsMap = {
	[string]: string
};

export type OrCondition = {
	data?: any,
	type: string
};

export type AndCondition = Array<OrCondition>;

export type SubGroup = {
	data: Array<AndCondition>,
	name: string
};

export type CustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<SubGroup>,
	timerValue: ?string,
	type: any
|};

export type Option = {
	hasReferenceToCurrentObject?: boolean,
	label: LangType,
	value: string
};

type OrConditionWithData = {
	data: any,
	type: string
};

export type OrConditionProps = {
	onChange: OrConditionWithData => void,
	value: OrCondition
};

export type CustomGroupProps = {
	forwardedRef: Ref<typeof CustomGroupComponent>,
	onSelect: (groupId: string) => void,
	onSubmit: (force: true) => Promise<void>,
	options: Array<CustomGroup>,
	submitted: boolean,
	type: string,
	value: string
};

export type Components = {
	CustomGroup: React$ComponentType<CustomGroupProps>,
	OrCondition: React$ComponentType<OrConditionProps>,
	SystemGroup: React$ComponentType<SystemPropsProps>
};

export type Props = {
	attribute: Attribute,
	components: Components,
	customGroups: Array<CustomGroup>,
	customTimerValue?: string,
	customType: string,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	orConditionOptions: Array<Option>,
	schema: Schema | null,
	systemOptions: Array<Option>,
	value: Group,
};

export type State = {
	attribute: Attribute,
	customData: string,
	submitted: boolean,
	submitting: boolean,
	systemData: string,
	way: GroupWay
};
