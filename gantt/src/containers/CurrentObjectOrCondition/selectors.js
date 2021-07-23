// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchCurrentObjectAttributes} from 'store/sources/currentObject/actions';

export const props = (state: AppState, props: Props): ConnectedProps => ({
	currentObjectData: state.sources.currentObject[props.attribute.type]
});

export const functions: ConnectedFunctions = {
	fetchCurrentObjectAttributes
};
