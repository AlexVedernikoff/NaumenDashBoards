// @flow
import type {Attribute} from 'store/sources/attributes/types';

export type Context = {
	filterAttributeByMainDataSet: (attributes: Array<Attribute>, dataSetIndex: number) => Array<Attribute>,
	filterAttributesByUsed: (attributes: Array<Attribute>, dataSetIndex: number, includeAttributes: ?Array<?Attribute>) => Array<Attribute>,
	getCommonAttributes: () => Array<Attribute>
};

export type InjectedProps = {
	helpers: Context
};
