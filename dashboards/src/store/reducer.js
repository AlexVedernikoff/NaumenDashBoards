// @flow
import {combineReducers} from 'redux';
import context from './context/reducer';
import customGroups from './customGroups/reducer';
import dashboard from './dashboard/reducer';
import {ROOT_EVENTS} from './constants';
import sources from './sources/reducer';
import toasts from './toasts/reducer';
import widgets from './widgets/reducer';

const appReducer = combineReducers({
	context,
	customGroups,
	dashboard,
	sources,
	toasts,
	widgets
});

const rootReducer = (state: Object, action: Object) => {
	switch (action.type) {
		case ROOT_EVENTS.RESET_STATE:
			return appReducer({context: state.context, sources: state.sources}, action);
		case ROOT_EVENTS.SWITCH_STATE:
			return appReducer({...state, ...action.payload}, action);
	}

	return appReducer(state, action);
};

export default rootReducer;
