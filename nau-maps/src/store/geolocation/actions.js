// @flow
import type {Dispatch, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from './constants';
import {getContext, getMapObjects, getParams} from 'utils/api';
import type {GroupCode, Point, PointType} from 'types/point';
import {notify} from 'helpers/notify';
import testData from 'helpers/testData';

const environment = process.env.NODE_ENV;

/**
 * Получаем данные, необходимые для работы карты
 * @returns {ThunkAction}
 */
const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<any> => {
	try {
		const context = getContext();
		const params = await getParams();

		dispatch(setContext(context));
		dispatch(setParams(params))
			.then(() => dispatch(fetchGeolocation(true)))
			.catch(error => error);
	} catch (error) {
		dispatch(recordGeolocationdError(error));
	}
};

const fetchGeolocation = (firstCall: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let markers = testData;
		const {context} = getState().geolocation;
		const {contentCode, subjectUuid} = context;

		if (environment !== 'development') {
			markers = await getMapObjects(contentCode, subjectUuid);
		}

		const {errors} = markers;

		if (errors && errors.length > 0) {
			const label = errors.join(', ') + '.';
			notify('common', 'info', label);
		}

		dispatch(setData(markers, firstCall));
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError(error));
	}
};

const setContext = (payload: Object) => ({
	type: GEOLOCATION_EVENTS.SET_CONTEXT,
	payload
});

const setParams = (payload: Object) => dispatch => {
	dispatch({
		type: GEOLOCATION_EVENTS.SET_PARAMS,
		payload
	});
	return Promise.resolve();
};

const setData = (payload: Object, firstCall) => ({
	type: GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION,
	payload: {
		...payload,
		firstCall
	}
});

const recordGeolocationdError = (error) => ({
	type: GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR,
	payload: error
});

const setTab = (payload: PointType) => ({
	type: GEOLOCATION_EVENTS.SET_TAB,
	payload
});

const setSingleObject = (data: Point) => ({
	type: GEOLOCATION_EVENTS.SET_SINGLE_POINT,
	payload: data
});

const resetSingleObject = () => ({
	type: GEOLOCATION_EVENTS.RESET_SINGLE_POINT
});

const togglePanel = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_PANEL
});

const toggleFilter = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_FILTER
});

const toggleGroup = (payload: GroupCode) => ({
	type: GEOLOCATION_EVENTS.TOGGLE_GROUP,
	payload
});

const resetAllGroups = () => ({
	type: GEOLOCATION_EVENTS.RESET_ALL_GROUPS
});

const selectAllGroups = () => ({
	type: GEOLOCATION_EVENTS.SELECT_ALL_GROUPS
});

export {
	fetchGeolocation,
	getAppConfig,
	resetAllGroups,
	resetSingleObject,
	selectAllGroups,
	setSingleObject,
	setTab,
	toggleFilter,
	toggleGroup,
	togglePanel
};
