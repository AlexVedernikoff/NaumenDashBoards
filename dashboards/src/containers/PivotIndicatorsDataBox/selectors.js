// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributeByCode} from 'store/sources/attributes/actions';

export const props = (state: AppState): ConnectedProps => ({
});

export const functions: ConnectedFunctions = {
	fetchAttributeByCode
};
