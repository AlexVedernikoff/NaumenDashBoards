// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {TYPES} from './constants';

export type RefInputType =
	| typeof TYPES.AGGREGATION
	| typeof TYPES.GROUP
;

export type Props = {
	attribute: Attribute | null,
	mixin: Object,
	name: string,
	onSelect: (name: string, value: string) => void,
	type: RefInputType,
	value: string
};

export type State = {
	options: []
};
