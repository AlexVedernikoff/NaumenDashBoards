// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {BUILD_DATA_EVENTS} from './constants';
import {defaultAction, initialBuildDataState} from './init';
import {setBuildData, setBuildDataError, setRequestBuildData} from './helpers';

const reducer = (state: BuildDataState = initialBuildDataState, action: BuildDataAction = defaultAction): BuildDataState => {
	switch (action.type) {
		case BUILD_DATA_EVENTS.REQUEST_BUILD_DATA:
			setRequestBuildData(state, action.payload);
			return {...state};
		case BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA:
			setBuildData(state, action.payload);
			return {...state};
		case BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR:
			setBuildDataError(state, action.payload);
			return {...state};
		default:
			return state;
	}
};

export default reducer;
