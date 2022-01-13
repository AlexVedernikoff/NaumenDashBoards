// @flow
import {createContext} from 'react';
import type {SubscribeContext} from './types';

const SUBSCRIBE_CONTEXT = createContext<SubscribeContext>({
	subscribe: (action, handle) => undefined,
	unsubscribe: (action, handle) => undefined
});

SUBSCRIBE_CONTEXT.displayName = 'SUBSCRIBE_CONTEXT';

const FORCE_SAVE: 'FORCE_SAVE' = 'FORCE_SAVE';

const SUBSCRIBE_COMMANDS = {
	FORCE_SAVE
};

export {
	SUBSCRIBE_CONTEXT,
	SUBSCRIBE_COMMANDS
};
