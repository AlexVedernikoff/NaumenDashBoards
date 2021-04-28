// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup} from 'store/customGroups/types';
import type {Group} from 'store/widgets/data/types';
import type {RenderProps as SelectRenderProps} from 'GroupModal/components/SelectOrCondition/types';
import type {RenderProps as MultiSelectRenderProps} from 'GroupModal/components/MultiSelectOrCondition/types';

export type Option = {
	title: string,
	uuid: string
};

export type RenderProps = SelectRenderProps | MultiSelectRenderProps;

export type SelectProps = {|
	...RenderProps,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	multiple: boolean
|};

export type Components = {
	Select: React$ComponentType<SelectProps>
};

export type ConnectedProps = {
	customGroups: Array<CustomGroup>
};

export type Props = ConnectedProps & {
	attribute: Attribute,
	components: Components,
	customType: string,
	onClose: () => void,
	onFetch: (type: string) => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	orConditionOptions: Array<Option>,
	value: Group
};
