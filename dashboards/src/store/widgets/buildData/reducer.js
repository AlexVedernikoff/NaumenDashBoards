// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {BUILD_DATA_EVENTS} from './constants';
import {defaultAction, initialBuildDataState} from './init';
import {setBuildData, setBuildDataError, setRequestBuildData} from './helpers';

const reducer = (state: BuildDataState = initialBuildDataState, action: BuildDataAction = defaultAction): BuildDataState => {
	switch (action.type) {
		case BUILD_DATA_EVENTS.REQUEST_BUILD_DATA:
			return setRequestBuildData(state, action.payload);
		case BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA:
			return setBuildData(state, action.payload);
		case BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR:
			return setBuildDataError(state, action.payload);
		default:
			return state;
	}
};

export default reducer;
