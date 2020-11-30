// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group, Source} from 'store/widgets/data/types';

export type GroupAttributeField = {
	name: string,
	parent: Attribute | null,
	value: Attribute,
};

export type Props = {
	disabled: boolean,
	field: GroupAttributeField,
	name: string,
	onChange: (name: string, value: Group, field: GroupAttributeField) => void,
	source: Source,
	value: Group | string | null
};

export type State = {
	showModal: boolean
};
