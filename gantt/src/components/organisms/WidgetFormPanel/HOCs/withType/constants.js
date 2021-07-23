// @flow
import type {Context} from './types';
import {createContext} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const TYPE_CONTEXT = createContext<Context>({
	onChange: () => undefined,
	value: WIDGET_TYPES.COLUMN
});

export {
	TYPE_CONTEXT
};
