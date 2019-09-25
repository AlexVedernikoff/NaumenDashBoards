// @flow
import axios from 'axios';
import {BASE_URL, KEY} from 'constants/api';
import {DATA_SOURCES_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {RawDataSource} from './types';

/**
 * Получаем типы базового класса
 * @param {string} payload - fqn класса
 * @returns {ThunkAction}
 */
const fetchDataSources = (payload: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {data} = await axios.post(`${BASE_URL}/exec-post?accessKey=${KEY}&func=modules.dashboards.getDataSources&params='${payload}'`);
		dispatch(receiveDataSource(data, payload));
	} catch (error) {
		dispatch(recordDataSourcesError(payload));
	}
};

const setRootDataSources = (payload: RawDataSource[]) => ({
	type: DATA_SOURCES_EVENTS.SET_ROOT_DATA_SOURCES,
	payload
});

const receiveDataSource = (dataSources, fqn) => ({
	type: DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES,
	payload: {dataSources, fqn}
});

const recordDataSourcesError = (payload: string) => ({
	type: DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR,
	payload
});

export {
	fetchDataSources,
	setRootDataSources
};
