// @flow
import api from 'api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {ReceivePayload} from './types';

/**
 * Получает значения, найденные по мета-классу атрибута
 * @param {string} metaClassFqn - метакласс, в котором этот атрибут создан
 * @returns {ThunkAction}
 */
const fetchMetaClassData = (metaClassFqn: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestMetaClassData(metaClassFqn));

	try {
		const data = await api.instance.dashboards.getMetaClasses(metaClassFqn);

		dispatch(receiveMetaClassData({data, metaClassFqn}));
	} catch (error) {
		dispatch(recordMetaClassDataError(metaClassFqn));
	}
};

const requestMetaClassData = (payload: string) => ({payload, type: 'REQUEST_META_CLASS_DATA'});

const recordMetaClassDataError = (payload: string) => ({payload, type: 'RECORD_META_CLASS_DATA_ERROR'});

const receiveMetaClassData = (payload: ReceivePayload) => ({payload, type: 'RECEIVE_META_CLASS_DATA'});

export {
	fetchMetaClassData
};
