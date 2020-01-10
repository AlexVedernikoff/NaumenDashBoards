// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Node} from 'react';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import {TYPES} from './constants';

export type RefInputType =
	| typeof TYPES.AGGREGATION
	| typeof TYPES.COMPUTE
	| typeof TYPES.GROUP
;

export type Props = {
	attribute: Attribute | null,
	mixin: Object,
	name: string,
	onSelect: (name: string, value: string) => void,
	renderValue?: (props: RenderValueProps) => Node,
	type: RefInputType,
	value: string
};

export type State = {
	options: []
};
