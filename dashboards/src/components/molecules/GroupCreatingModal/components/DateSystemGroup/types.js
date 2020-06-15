// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Props as SystemProps} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';

export type Props = {
	...SystemProps,
	attribute: Attribute
};

type Option = {
	label: string,
	value: string
};

export type State = {
	format: string,
	group: string,
	options: Array<Option>
};
