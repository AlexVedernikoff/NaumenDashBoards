// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {defaultAction, initialBuildDataState} from './init';
import {BUILD_DATA_EVENTS} from './constants';
import {resetData, setBuildData, setBuildDataError, setRequestBuildData} from './helpers';
import {WIDGETS_EVENTS} from 'store/widgets/data/constants';

const reducer = (state: BuildDataState = initialBuildDataState, action: BuildDataAction = defaultAction): BuildDataState => {
	switch (action.type) {
		case BUILD_DATA_EVENTS.REQUEST_BUILD_DATA:
			setRequestBuildData(state, action.payload);
			return {...state};
		case BUILD_DATA_EVENTS.REQUEST_ALL_BUILD_DATA:
			action.payload.forEach(({id}) => {
				setRequestBuildData(state, id);
			});
			return {...state};
		case BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA:
			setBuildData(state, action.payload);
			return {...state};
		case BUILD_DATA_EVENTS.RECEIVE_ALL_BUILD_DATA:
			Object.keys(action.payload).forEach(id => {
				// $FlowFixMe
				setBuildData(state, {data: action.payload[id], id: id});
			});
			return {...state};
		case BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR:
			setBuildDataError(state, action.payload);
			return {...state};
		case BUILD_DATA_EVENTS.RECORD_ALL_BUILD_DATA_ERROR:
			action.payload.forEach(({id}) => {
				setBuildDataError(state, id);
			});
			return {...state};
		case WIDGETS_EVENTS.UPDATE_WIDGET:
		case WIDGETS_EVENTS.SET_CREATED_WIDGET:
			resetData(state, action);
			return {...state};
		default:
			return state;
	}
};

export default reducer;
