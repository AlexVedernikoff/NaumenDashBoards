// @flow
import type {ConnectedFunctions} from './types';
import {getAppConfig} from 'store/signature/actions';

export const functions: ConnectedFunctions = {
	getAppConfig
};
