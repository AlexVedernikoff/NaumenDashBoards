// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from 'store/geolocation/constants';
import {getContext, getEditForm, getMapObjects, getParams, getUuidObjects} from 'utils/api';
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

const fetchGeolocation = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let data = testData;
		const {context: {contentCode, currentUser, subjectUuid}} = getState().geolocation;

		if (environment !== 'development') {
			data = await getMapObjects(contentCode, subjectUuid, currentUser);
		}

		const {errors, mapApiKey = {}, objects, formCode} = data;

		if (errors && errors.length > 0) {
			const label = errors.join(', ') + '.';
			notify('common', 'info', label);
		}

		dispatch(setMap(mapApiKey));
		dispatch(setData(objects));

		const nauMapsMapLastSelect = localStorage.getItem('nauMapsMapLastSelect');

		if (nauMapsMapLastSelect && Object.prototype.hasOwnProperty.call(mapApiKey, nauMapsMapLastSelect)) {
			dispatch(setMapPanel(nauMapsMapLastSelect));
		}

		if (formCode) {
			dispatch(setEditForm(formCode));
		}
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError(error));
	}
};

const goToElementMap = () => ({
	type: GEOLOCATION_EVENTS.GO_TO_ELEMENT
});

const showEditForm = (objectUUID: string, codeEditingForm: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const uuid = await getEditForm(objectUUID, codeEditingForm);

		if (uuid) {
			dispatch(fetchGeolocation);
		}
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError(error));
	}
};

const zoomIn = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {controls: {maxZoom, zoom}} = getState().geolocation;

		if (zoom < maxZoom) {
			dispatch(changeZoom(zoom + 1));
		}
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError(error));
	}
};

const zoomOut = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {controls: {minZoom, zoom}} = getState().geolocation;

		if (zoom > minZoom) {
			dispatch(changeZoom(zoom - 1));
		}
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

const setData = (payload: Object) => ({
	payload,
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

const searchMapObject = (searchQuery: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const uuids = await getUuidObjects(searchQuery);
		const { mapObjects } = getState().geolocation;

		if (uuids) {
			const entities = mapObjects.filter(({data: { uuid }}) => {
				return uuids.includes(uuid);
			});

			dispatch({
				payload: entities,
				type: GEOLOCATION_EVENTS.SET_SEARCH_POINTS
			});
		}
	} catch (error) {
		dispatch(recordGeolocationdError(error));
	}

	dispatch({
		payload: searchQuery,
		type: GEOLOCATION_EVENTS.SET_SEARCH_TEXT
	});
};

const setMapPanel = (map: string) => ({
	payload: map,
	type: GEOLOCATION_EVENTS.SET_MAP_PANEL
});

const setMap = (map: string) => ({
	payload: map,
	type: GEOLOCATION_EVENTS.SET_MAP_ARRAY
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

const changeZoom = zoom => ({
	payload: zoom,
	type: GEOLOCATION_EVENTS.CHANGE_ZOOM
});

const selectAllGroups = () => ({
	type: GEOLOCATION_EVENTS.SELECT_ALL_GROUPS
});

/**
 * Установка кода для вызова формы редактирования
 * @param {string} payload - код
 */
const setEditForm = (payload: string) => ({
	payload,
	type: GEOLOCATION_EVENTS.SET_EDIT_FORM
});

export {
	goToElementMap,
	changeZoom,
	fetchGeolocation,
	getAppConfig,
	resetAllGroups,
	resetSingleObject,
	selectAllGroups,
	setSingleObject,
	setMapPanel,
	setTab,
	searchMapObject,
	showEditForm,
	toggleFilter,
	toggleGroup,
	toggleMapPanel,
	toggleMapContextMenu,
	togglePanel,
	zoomIn,
	zoomOut
};
