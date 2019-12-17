// @flow
import type {DashboardState, Role} from './types';

const setAutoUpdateFunction = (state: DashboardState, fn: IntervalID) => {
	if (state.autoUpdate.fn) {
		clearInterval(state.autoUpdate.fn);
	}

	state.autoUpdate.fn = fn;
};

const setRole = (state: DashboardState, role: Role) => {
	state.role = role;

	if (!state.editable) {
		state.editable = !!role;
	}
};

export {
	setAutoUpdateFunction,
	setRole
};
