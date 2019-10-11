// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {goOver} from 'store/widgets/links/actions';

export const props = (state: AppState): ConnectedProps => ({
	diagrams: state.widgets.diagrams.map
});

export const functions: ConnectedFunctions = {
	goOver
};
