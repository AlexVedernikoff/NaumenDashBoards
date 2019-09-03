// @flow
import {initialAppState} from 'init/app';
import type {State} from 'types'

const defaultGetState = (): State => ({
	app: initialAppState
});

export {
	defaultGetState
};
