// @flow
import {buildUrl, client} from 'utils/api';
import {DATA_SOURCES_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {RawDataSource} from './types';

const getDataSources = (): ThunkAction => async (dispatch: Dispatch) => {
	dispatch(requestDataSources());

	try {
		const {data} = await client.post(buildUrl('dashboards', 'getDataSources'));
		dispatch(receiveDataSources(data));
	} catch (e) {
		dispatch(recordErrorDataSources());
	}
};

const receiveDataSources = (payload: RawDataSource[]) => ({
	type: DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES,
	payload
});

const recordErrorDataSources = () => ({
	type: DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR
});

const requestDataSources = () => ({
	type: DATA_SOURCES_EVENTS.REQUEST_DATA_SOURCES
});

export {
	getDataSources
};
