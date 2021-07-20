// @flow
import type {Context} from './types';
import {createContext} from 'react';

const ATTRIBUTE_FIELDSET_CONTEXT = createContext<Context>({
	dataKey: '',
	dataSetIndex: 0,
	source: {
		descriptor: '',
		filterId: null,
		value: null
	}
});

ATTRIBUTE_FIELDSET_CONTEXT.displayName = 'ATTRIBUTE_FIELDSET_CONTEXT';

export {
	ATTRIBUTE_FIELDSET_CONTEXT
};
