// @flow
import type {DefaultLocationPoints, Entity, ListViews, ViewData} from './types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getContext, getEditForm, getScheme, getUuidObjects, saveLocationSettings} from 'utils/api';
import {VERIFY_EVENTS} from './constants';

/**
 * Получает данные, необходимые для работы
 *
 * @returns {ThunkAction}
 * @param entitiesData
 */
const saveEntitiesLocationSettings = (entitiesData: DefaultLocationPoints[]): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());
		const {currentUser} = await getContext();
		await saveLocationSettings(currentUser, entitiesData);
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getDataEntity = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());
		const {contentCode, currentUser, subjectUuid} = await getContext();
		const {dataDefaultLocationPoints, entities, listViews} = await getScheme(contentCode, subjectUuid, currentUser);

		const {personalView: {viewData = [], defaultSchemaKey = null}} = listViews;

		if (viewData.length && defaultSchemaKey) {
			const view = viewData.find(viewData => viewData.value === defaultSchemaKey);
			view && dispatch(setDefaultViewData(view));
		}

		dispatch(setDefaultLocationPointsData(dataDefaultLocationPoints));
		dispatch(setListViewsData(listViews));
		dispatch(setEntitiesData(entities));
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Запрашивает форму редактирования для элемента и обновляет данные
 * @param {string} objectUUID - uuid обьекта
 * @param {string} codeEditingForm - код формы
 */
const showEditForm = (objectUUID: string, codeEditingForm: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const uuid = await getEditForm(objectUUID, codeEditingForm);

		if (uuid) {
			const {contentCode, currentUser, subjectUuid} = await getContext();
			const {entities} = await getScheme(contentCode, subjectUuid, currentUser);

			dispatch(setEntitiesData(entities));
		}
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Сохраняет дефолтный список видов на схеме
 * @param {ViewData} payload - данные вида
 */
const setDefaultViewData = (payload: ViewData) => ({
	payload,
	type: VERIFY_EVENTS.SET_DEFAULT_VIEW_DATA
});

/**
 * Сохраняет полученные данные о элементах на схеме
 * @param {Entity[]} payload - данные вида
 */
const setEntitiesData = (payload: Entity[]) => ({
	payload,
	type: VERIFY_EVENTS.SET_ENTITIES_DATA
});

/**
 * Сохраняет данные уже сохраненных расположений точек
 * @param {DefaultLocationPoints[]} payload - дефолтные позиции
 */
const setDefaultLocationPointsData = (payload: DefaultLocationPoints[]) => ({
	payload,
	type: VERIFY_EVENTS.SET_DEFAULT_LOCATION_POINTS
});

/**
 * Сохраняет полученные данные о личных и глобальных видах
 * @param {ListViews} payload - обьект с данными видов
 */
const setListViewsData = (payload: ListViews) => ({
	payload,
	type: VERIFY_EVENTS.SET_LIST_VIEWS
});

/**
 * Переключает режим редактирования
 * @param {boolean} payload - флаг редактирования
 */
const changeEditingGlobal = (payload: boolean) => ({
	payload,
	type: VERIFY_EVENTS.CHANGE_EDITING_GLOBAL
});

/**
 * Центрует схему по выбранному элементу
 * @param {string} uuid - uuid обьекта
 */
const goToPoint = (uuid: string) => ({
	type: VERIFY_EVENTS.SET_CENTER_POINT_UUID,
	uuid
});

/**
 * Показывает индикатор загрузки данных
 */
const showLoaderData = () => ({
	type: VERIFY_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderData = () => ({
	type: VERIFY_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorData = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_ERROR_DATA
});

/**
 * Установка выбранного едемента
 * @param {string} payload - елемент
 */
const setActiveElement = (payload: Entity | null) => ({
	payload,
	type: VERIFY_EVENTS.SET_ACTIVE_ELEMENT
});

/**
 * Установка зума
 * @param {boolean | undefined} delta - направление изменения зума, при отсутствии сброс к дефолту
 * @returns {number} значение зума
 */
const setScale = (delta: boolean | undefined): number => (dispatch: Dispatch, getState: GetState): number => {
	const {scale} = getState().entity;

	let newScale = scale;

	if (delta === undefined) {
		newScale = 1;
	} else if (delta) {
		if (scale === 2) {
			return scale;
		}

		if (scale >= 1) {
			newScale = scale + 0.5;
		} else {
			newScale = scale * 2;
		}
	} else {
		if (scale === 0.25) {
			return scale;
		}

		if (scale >= 1) {
			newScale = scale - 0.5;
		} else {
			newScale = scale / 2;
		}
	}

	dispatch({
		payload: newScale,
		type: VERIFY_EVENTS.SET_SCALE
	});

	return newScale;
};

/**
 * Установка экспорта
 * @param {string} payload - формат
 */
const setExportTo = (payload: string | null) => ({
	payload,
	type: VERIFY_EVENTS.SET_EXPORT_TO
});

/**
 * Установка позиции холста
 * @param {{x: number, y: number}} payload - координаты
 */
const setPosition = (payload: {x: number, y: number}) => ({
	payload,
	type: VERIFY_EVENTS.SET_POSITION
});

/**
 * Установка поискового запроса, получение списка uuids и сохранение найденных результатов
 * @param {string} searchString - строка
 */
const setSearchText = (searchString: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch({
		payload: searchString,
		type: VERIFY_EVENTS.SET_SEARCH_TEXT
	});

	if (searchString.length) {
		try {
			const uuids = await getUuidObjects(searchString);

			const { data } = getState().entity;

			if (uuids) {
				const entities = data.flat().filter(({ uuid }) => {
					return uuids.includes(String(uuid));
				});
				dispatch(setSearchObjects(entities));
			}
		} catch (error) {
			dispatch(setErrorData(error));
		}
	} else {
		dispatch(setSearchObjects([]));
	}
};

/**
 * Установка найденных обьектов
 * @param {Entity[]} objects - элементы
 */
const setSearchObjects = (objects: Entity[]) => ({
	objects,
	type: VERIFY_EVENTS.SET_SEARCH_POINTS
});

/**
 * Установка флага попапа выбора вида
 * @param {boolean} payload - флаг видимости попапа
 */
const changePopupSaveViews = (payload: boolean) => ({
	payload,
	type: VERIFY_EVENTS.CHANGE_POPUP_SAVE_VIEWS
});

/**
 * Установка флага попапа настройки видов
 * @param {boolean} payload - флаг видимости попапа
 */
const changePopupSettingViews = (payload: boolean) => ({
	payload,
	type: VERIFY_EVENTS.CHANGE_POPUP_SETTING_VIEWS
});

export {
	changePopupSaveViews,
	changePopupSettingViews,
	changeEditingGlobal,
	setActiveElement,
	setDefaultViewData,
	setPosition,
	setSearchText,
	setSearchObjects,
	setScale,
	setExportTo,
	saveEntitiesLocationSettings,
	showEditForm,
	goToPoint,
	getDataEntity
};
