// @flow
import {arrayToTree} from 'utils/arrayToTree';
import {DATA_SOURCES_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {RawDataSource} from './types';

const getDataSourceValue = ({classFqn: value, hasDynamic, title: label}: RawDataSource) => ({
	hasDynamic,
	label,
	value
});

const getDataSources = (): ThunkAction => async (dispatch: Dispatch) => {
	dispatch({
		type: DATA_SOURCES_EVENTS.REQUEST_DATA_SOURCES
	});

	try {
		const data = await window.jsApi.restCallModule('dashboards', 'getDataSources');

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
	}
};

export {
	getDataSourceValue,
	getDataSources
};
