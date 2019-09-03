// @flow
import {APP_EVENTS} from 'constants/app';
import type {Dispatch, GetState, ThunkAction} from 'types';

const increment = (): ThunkAction => (dispatch: Dispatch, getState?: GetState): void => {
	dispatch({type: APP_EVENTS.ACTION_EXAMPLE});
};

export {
	increment
};
