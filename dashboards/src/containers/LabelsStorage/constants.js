// @flow
import type {Context} from './types';
import {createContext} from 'react';

const LABELS_STORAGE_CONTEXT = createContext<Context>({
	clearLabels: () => {},
	getLabels: () => [],
	registerLabel: () => {}
});

LABELS_STORAGE_CONTEXT.displayName = 'LABELS_STORAGE_CONTEXT';

export {
	LABELS_STORAGE_CONTEXT
};
