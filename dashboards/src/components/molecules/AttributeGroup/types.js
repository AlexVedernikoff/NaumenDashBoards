// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group} from 'store/widgets/data/types';

export type Props = {
	attribute: Attribute | null,
	disabled: boolean,
	name: string,
	onChange: (name: string, value: Group, attributeTitle: string) => void,
	value: Group | string
};

export type State = {
	showModal: boolean
};
