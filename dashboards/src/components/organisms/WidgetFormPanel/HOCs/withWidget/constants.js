// @flow
import type {AnyWidget} from 'src/store/widgets/data/types';
import {createContext} from 'react';
import NewWidget from 'src/store/widgets/data/NewWidget';

const WIDGET_CONTEXT = createContext<AnyWidget | NewWidget>(new NewWidget());

WIDGET_CONTEXT.displayName = 'WIDGET_CONTEXT';

export {
	WIDGET_CONTEXT
};
