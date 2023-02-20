// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DynamicGroupsNode} from 'store/sources/dynamicGroups/types';

export type DynamicAttributes = {[key: string]: DynamicGroupsNode} | {};

export type Context = {
	filterAttributeByMainDataSet: (attributes: Array<Attribute>, dataSetIndex: number) => Array<Attribute>,
	filterAttributesByUsed: (attributes: Array<Attribute>, dataSetIndex: number, includeAttributes: ?Array<?Attribute>) => Array<Attribute>,
	filterBreakdownAttributeByMainDataSet: (attributes: Array<Attribute>, dataSetIndex: number) => Array<Attribute>,
	filterDynamicAttributes: (attributes: DynamicAttributes, dataSetIndex: number, includeAttributes: ?Array<?Attribute>) => DynamicAttributes,
	filterUncomfortableAttributes: (attributes: Array<Attribute>) => Array<Attribute>,
	getCommonAttributes: (attributes: Array<Attribute>) => Array<Attribute>
};

export type InjectedProps = {
	attributesHelpers: Context
};
