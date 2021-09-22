// @flow
import api from 'api';
import {arrayToTree} from 'utils/arrayToTree';
import {DATA_SOURCES_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {RawDataSource} from './types';

const getDataSourceValue = ({classFqn: value, descriptor, hasDynamic, title: label}: RawDataSource) => ({
	descriptor,
	hasDynamic,
	label,
	value
});

const getDataSources = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	dispatch({
		type: DATA_SOURCES_EVENTS.REQUEST_DATA_SOURCES
	});

	try {
		const state = getState();
		const {dashboardUUID} = state.dashboard.settings;
		const data = await api.instance.dashboards.getDataSources(dashboardUUID);

		dispatch({
			payload: arrayToTree(data, {
				keys: {
					value: 'classFqn'
				},
				values: {
					id: node => node.classFqn,
					value: getDataSourceValue
				}
			}),
			type: DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES
		});
	} catch (e) {
		dispatch({
			type: DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR
		});
		throw e;
	}
};

export {
	getDataSourceValue,
	getDataSources
};
