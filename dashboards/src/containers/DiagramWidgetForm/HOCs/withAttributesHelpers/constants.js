// @flow
import type {Context} from './types';
import {createContext} from 'react';

const ATTRIBUTES_HELPERS_CONTEXT = createContext<Context>({
	filterAttributeByMainDataSet: () => [],
	filterAttributesByUsed: () => [],
	filterBreakdownAttributeByMainDataSet: () => [],
	getCommonAttributes: () => []
});

ATTRIBUTES_HELPERS_CONTEXT.displayName = 'ATTRIBUTES_HELPERS_CONTEXT';

export {
	ATTRIBUTES_HELPERS_CONTEXT
};
