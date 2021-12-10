// @flow
import type {ContextProps} from './types';
import {createContext} from 'react';
import {DEFAULT_LOCALE} from 'localization/constants';

const DEFAULT_CONTEXT_VALUE: ContextProps = {
	locale: DEFAULT_LOCALE,
	translate: key => key
};

export const TRANSLATION_CONTEXT: React$Context<ContextProps> = createContext(DEFAULT_CONTEXT_VALUE);
TRANSLATION_CONTEXT.displayName = 'COMMON_DIALOG_CONTEXT';
