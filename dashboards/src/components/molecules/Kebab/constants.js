// @flow
import type {ContextProps} from './types';
import {createContext} from 'react';

export const FORCE_TO_SHOW_CONTEXT: React$Context<ContextProps | null> = createContext(null);
FORCE_TO_SHOW_CONTEXT.displayName = 'FORCE_TO_SHOW_CONTEXT';
