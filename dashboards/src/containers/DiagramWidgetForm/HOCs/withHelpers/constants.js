// @flow
import type {Context} from './types';
import {createContext} from 'react';

const HELPERS_CONTEXT = createContext<Context>({
	filterAttributeByMainDataSet: () => [],
	filterAttributesByUsed: () => [],
	filterBreakdownAttributeByMainDataSet: () => [],
	getCommonAttributes: () => []
});

HELPERS_CONTEXT.displayName = 'HELPERS_CONTEXT';

export {
	HELPERS_CONTEXT
};
