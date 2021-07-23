// @flow
import {createContext} from 'react';
import type {ValuesContext} from './types';

const VALUES_CONTEXT = createContext<ValuesContext>({
	setFieldValue: () => undefined,
	values: {}
});

export {
	VALUES_CONTEXT
};
