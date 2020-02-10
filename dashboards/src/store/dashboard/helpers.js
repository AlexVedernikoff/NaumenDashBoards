// @flow
import type {DashboardState} from './types';

const setAutoUpdateFunction = (state: DashboardState, fn: IntervalID) => {
	if (state.autoUpdate.fn) {
		clearInterval(state.autoUpdate.fn);
	}

	state.autoUpdate.fn = fn;
};

export {
	setAutoUpdateFunction
};
