// @flow
import {createContext} from 'react';
import type {ValuesContext} from './types';

const VALUES_CONTEXT = createContext<ValuesContext>({
	setFieldValue: () => undefined,
	values: {}
});

VALUES_CONTEXT.displayName = 'VALUES_CONTEXT';

export {
	VALUES_CONTEXT
};
