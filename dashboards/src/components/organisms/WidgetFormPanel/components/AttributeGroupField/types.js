// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group, Source} from 'store/widgets/data/types';

export type Props = {
	attribute: Attribute | null,
	disabled: boolean,
	onChange: (value: Group, attribute: Attribute) => void,
	source: Source | null,
	value: Group | string | null
};

export type State = {
	showModal: boolean
};
