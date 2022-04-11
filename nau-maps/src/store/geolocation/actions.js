// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from 'store/geolocation/constants';
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

const zoomIn = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {controls: {zoom}} = getState().geolocation;
		dispatch(cnangeZoom(zoom + 1));
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError(error));
	}
};

const zoomOut = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {controls: {zoom}} = getState().geolocation;
		dispatch(cnangeZoom(zoom - 1));
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError(error));
	}
};

const setContext = (payload: Object) => ({
	payload,
	type: GEOLOCATION_EVENTS.SET_CONTEXT
});

const setParams = (payload: Object) => dispatch => {
	dispatch({
		payload,
		type: GEOLOCATION_EVENTS.SET_PARAMS
	});
	return Promise.resolve();
};

const setData = (payload: Object, firstCall) => ({
	payload: {
		...payload,
		firstCall
	},
	type: GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION
});

const recordGeolocationdError = error => ({
	payload: error,
	type: GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR
});

const setTab = (payload: PointType) => ({
	payload,
	type: GEOLOCATION_EVENTS.SET_TAB
});

const setSingleObject = (data: Point) => ({
	payload: data,
	type: GEOLOCATION_EVENTS.SET_SINGLE_POINT
});

const setMapPanel = (map: string) => ({
	payload: map,
	type: GEOLOCATION_EVENTS.SET_MAP_PANEL
});

const resetSingleObject = () => ({
	type: GEOLOCATION_EVENTS.RESET_SINGLE_POINT
});

const togglePanel = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_PANEL
});

const toggleMapPanel = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_MAP_PANEL
});

const toggleMapContextMenu = (data: Point) => ({
	payload: data,
	type: GEOLOCATION_EVENTS.TOGGLE_MAP_CONTENT_MENU
});

const toggleFilter = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_FILTER
});

const toggleGroup = (payload: GroupCode) => ({
	payload,
	type: GEOLOCATION_EVENTS.TOGGLE_GROUP
});

const resetAllGroups = () => ({
	type: GEOLOCATION_EVENTS.RESET_ALL_GROUPS
});

const cnangeZoom = zoom => ({
	payload: zoom,
	type: GEOLOCATION_EVENTS.CHANGE_ZOOM
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
	setMapPanel,
	setTab,
	toggleFilter,
	toggleGroup,
	toggleMapPanel,
	toggleMapContextMenu,
	togglePanel,
	zoomIn,
	zoomOut
};
