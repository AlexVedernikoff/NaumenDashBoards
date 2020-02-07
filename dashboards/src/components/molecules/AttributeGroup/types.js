// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {GROUP_TYPES} from 'store/widgets/constants';

export type GroupType = $Keys<typeof GROUP_TYPES>;

export type Group = {
	data: string,
	type: GroupType
};

export type Props = {
	attribute: Attribute | null,
	name: string,
	onChange: (name: string, value: Group, attributeTitle: string) => void,
	value: Group | string
};

export type State = {
	showModal: boolean
};
