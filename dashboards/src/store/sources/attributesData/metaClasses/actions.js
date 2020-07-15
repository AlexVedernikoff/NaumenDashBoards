// @flow
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import {META_CLASSES_EVENTS} from './constants';
import type {ReceivePayload} from './types';

/**
 * Получает значения, найденные по мета-классу атрибута
 * @param {string} metaClassFqn - метакласс, в котором этот атрибут создан
 * @returns {ThunkAction}
 */
const fetchMetaClassData = (metaClassFqn: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestMetaClassData(metaClassFqn));

	try {
		const {data} = await client.post(buildUrl('dashboards', 'getMetaClasses', `'${metaClassFqn}'`));
		dispatch(receiveMetaClassData({data, metaClassFqn}));
	} catch (error) {
		dispatch(recordMetaClassDataError(metaClassFqn));
	}
};

const requestMetaClassData = (payload: string) => ({
	payload,
	type: META_CLASSES_EVENTS.REQUEST_META_CLASS_DATA
});

const recordMetaClassDataError = (payload: string) => ({
	payload,
	type: META_CLASSES_EVENTS.RECORD_META_CLASS_DATA_ERROR
});

const receiveMetaClassData = (payload: ReceivePayload) => ({
	payload,
	type: META_CLASSES_EVENTS.RECEIVE_META_CLASS_DATA
});

export {
	fetchMetaClassData
};
