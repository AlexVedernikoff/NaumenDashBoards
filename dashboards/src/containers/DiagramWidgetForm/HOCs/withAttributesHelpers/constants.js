// @flow
import type {Context} from './types';
import {createContext} from 'react';

const ATTRIBUTES_HELPERS_CONTEXT = createContext<Context>({
	filterAttributeByMainDataSet: () => [],
	filterAttributesByUsed: () => [],
	filterBreakdownAttributeByMainDataSet: () => [],
	filterDynamicAttributes: () => ({}),
	filterUncomfortableAttributes: () => [],
	getCommonAttributes: () => []
});

ATTRIBUTES_HELPERS_CONTEXT.displayName = 'ATTRIBUTES_HELPERS_CONTEXT';

export {
	ATTRIBUTES_HELPERS_CONTEXT
};
