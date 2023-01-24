// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {defaultAction, initialBuildDataState} from './init';
import {setWidgetError, updateWidgetData} from './helpers';

const reducer = (state: BuildDataState = initialBuildDataState, action: BuildDataAction = defaultAction): BuildDataState => {
	switch (action.type) {
		case 'widgets/data/updateWidget':
			return updateWidgetData(state, action.payload);
		case 'widgets/buildData/requestBuildData':
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					error: null,
					loading: true,
					type: action.payload.type,
					updating: false
				}
			};
		case 'widgets/buildData/receiveBuildData':
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					data: action.payload.data,
					loading: false,
					updating: false
				}
			};
		case 'widgets/buildData/recordBuildDataError':
			return setWidgetError(state, action.payload);
		case 'widgets/buildData/updateBuildData':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					updating: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
