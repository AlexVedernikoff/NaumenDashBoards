// @flow
import {ROOT_EVENTS} from './constants';

const resetState = () => ({
	type: ROOT_EVENTS.RESET_STATE
});

const switchState = (payload: Object) => ({
	type: ROOT_EVENTS.SWITCH_STATE,
	payload
});

export {
	resetState,
	switchState
};
