// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group, Source} from 'store/widgets/data/types';

export type Props = {
	attribute: Attribute,
	disabled: boolean,
	name: string,
	onChange: (name: string, value: Group, attribute: Attribute) => void,
	parent: Attribute | null,
	source: Source | null,
	value: Group | string | null
};

export type State = {
	showModal: boolean
};
