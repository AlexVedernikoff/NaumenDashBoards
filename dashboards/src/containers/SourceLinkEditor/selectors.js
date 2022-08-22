// @flow
import type {AppState} from 'store/types';
import type {ComponentProps, ConnectedFunctions, ConnectedProps} from './types';
import {fetchLinkedAttributes} from 'store/sources/linkedAttributes/actions';

export const props = (state: AppState, props: ComponentProps): ConnectedProps => ({
	linkedAttributes: state.sources.linkedAttributes
});

export const functions: ConnectedFunctions = {
	fetchLinkedAttributes
};
