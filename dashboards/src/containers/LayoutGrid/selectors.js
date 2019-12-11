// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {comboDrillDown, drillDown} from 'store/widgets/links/actions';

export const props = (state: AppState): ConnectedProps => ({
	diagrams: state.widgets.diagrams
});

export const functions: ConnectedFunctions = {
	comboDrillDown,
	drillDown
};
