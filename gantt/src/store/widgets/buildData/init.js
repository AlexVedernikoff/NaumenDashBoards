// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {BUILD_DATA_EVENTS} from './constants';

export const initialBuildDataState: BuildDataState = {};

export const defaultAction: BuildDataAction = {
	type: BUILD_DATA_EVENTS.UNKNOWN_BUILD_DATA_ACTION
};
