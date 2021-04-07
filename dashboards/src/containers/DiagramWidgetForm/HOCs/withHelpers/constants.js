// @flow
import type {Context} from './types';
import {createContext} from 'react';

const HELPERS_CONTEXT = createContext<Context>({
	filterAttributesByUsed: () => []
});

export {
	HELPERS_CONTEXT
};
