// @flow
import {combineReducers} from 'redux';
import commonDialogs from './commonDialogs/reducer';
import context from './context/reducer';
import customGroups from './customGroups/reducer';
import dashboard from './dashboard/reducer';
import dashboards from './dashboards/reducer';
import {ROOT_EVENTS} from './constants';
import sources from './sources/reducer';
import toasts from './toasts/reducer';
import users from './users/reducer';
import widgets from './widgets/reducer';

const appReducer = combineReducers({
	commonDialogs,
	context,
	customGroups,
	dashboard,
	dashboards,
	sources,
	toasts,
	users,
	widgets
});

const rootReducer = (state: Object, action: Object) => {
	switch (action.type) {
		case ROOT_EVENTS.RESET_STATE:
			return appReducer({context: state.context, sources: state.sources, users: state.users}, action);
		case ROOT_EVENTS.SWITCH_STATE:
			return appReducer({...state, ...action.payload}, action);
	}

	return appReducer(state, action);
};

export default rootReducer;
