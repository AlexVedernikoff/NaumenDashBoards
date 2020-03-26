// @flow
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {ReceivePayload} from './types';
import {STATES_EVENTS} from './constants';

/**
 * Получает статусы, найденные по мета-классу атрибута
 * @param {string} metaClassFqn - метакласс, в котором этот атрибут создан
 * @returns {ThunkAction}
 */
const fetchMetaClassStates = (metaClassFqn: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestMetaClassStates(metaClassFqn));

	try {
		const {data} = await client.post(buildUrl('dashboards', 'getStates', `'${metaClassFqn}'`));
		dispatch(receiveMetaClassStates({data, metaClassFqn}));
	} catch (error) {
		dispatch(recordMetaClassStatesError(metaClassFqn));
	}
};

const requestMetaClassStates = (payload: string) => ({
	type: STATES_EVENTS.REQUEST_META_CLASS_STATES,
	payload
});

const recordMetaClassStatesError = (payload: string) => ({
	type: STATES_EVENTS.RECORD_META_CLASS_STATES_ERROR,
	payload
});

const receiveMetaClassStates = (payload: ReceivePayload) => ({
	type: STATES_EVENTS.RECEIVE_META_CLASS_STATES,
	payload
});

export {
	fetchMetaClassStates
};
