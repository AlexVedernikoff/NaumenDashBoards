// @flow
import api from 'api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {ReceivePayload} from './types';

/**
 * Получает статусы, найденные по мета-классу атрибута
 * @param {string} metaClassFqn - метакласс, в котором этот атрибут создан
 * @returns {ThunkAction}
 */
const fetchMetaClassStates = (metaClassFqn: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestMetaClassStates(metaClassFqn));

	try {
		const data = await api.instance.dashboards.getStates(metaClassFqn);

		dispatch(receiveMetaClassStates({data, metaClassFqn}));
	} catch (error) {
		dispatch(recordMetaClassStatesError(metaClassFqn));
	}
};

const requestMetaClassStates = (payload: string) => ({payload, type: 'REQUEST_META_CLASS_STATES'});

const recordMetaClassStatesError = (payload: string) => ({payload, type: 'RECORD_META_CLASS_STATES_ERROR'});

const receiveMetaClassStates = (payload: ReceivePayload) => ({payload, type: 'RECEIVE_META_CLASS_STATES'});

export {
	fetchMetaClassStates
};
