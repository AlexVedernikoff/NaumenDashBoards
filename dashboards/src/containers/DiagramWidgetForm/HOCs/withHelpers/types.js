// @flow
import type {Attribute} from 'store/sources/attributes/types';

export type Context = {
	filterAttributesByUsed: (attributes: Array<Attribute>, dataSetIndex: number) => Array<Attribute>
};

export type InjectedProps = {
	helpers: Context
};
