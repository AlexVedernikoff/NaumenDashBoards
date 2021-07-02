// @flow
import {createContext} from 'react';
import type {ErrorsContext} from 'components/organisms/WidgetForm/HOCs/withErrors/types';

const ERRORS_CONTEXT = createContext<ErrorsContext>({
	errors: {},
	setErrorFocusRef: () => undefined
});

ERRORS_CONTEXT.displayName = 'ERRORS_CONTEXT';

export {
	ERRORS_CONTEXT
};
