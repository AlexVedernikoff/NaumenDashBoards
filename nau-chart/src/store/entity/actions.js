// @flow
import type {Dispatch, Entity, GetState, ThunkAction} from 'store/types';
import {getContext, getEditForm, getScheme} from 'utils/api';
import {VERIFY_EVENTS} from './constants';

/**
 * Получает данные, необходимые для работы
 * @returns {ThunkAction}
 */
const getDataEntity = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());
		const {contentCode, currentUser, subjectUuid} = await getContext();
		const {entities, formCode} = await getScheme(contentCode, subjectUuid, currentUser);

		dispatch(setEntityData(entities));

		if (formCode) {
			dispatch(setEditForm(formCode));
		}
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
			dispatch(getDataEntity);
		}
	} catch (error) {
		dispatch(setErrorData(error));
	}
};

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
 * Сохраняет полученные стартовые настройки
 * @param {string} payload - contentCode
 */
const setEntityData = (payload: string) => ({
	payload,
	type: VERIFY_EVENTS.SET_DATA
});

/**
 * Установка выбранного едемента
 * @param {string} payload - елемент
 */
const setActiveElement = (payload: Entity) => ({
	payload,
	type: VERIFY_EVENTS.SET_ACTIVE_ELEMENT
});

/**
 * Установка зума
 * @param {boolean | undefined} delta - направление изменения зума, при отсутствии сброс к дефолту
 * @returns {ThunkAction<number>} значение зума
 */
const setScale = (delta: boolean | undefined): ThunkAction => (dispatch: Dispatch, getState: GetState): number => {
	const {scale} = getState().entity;

	let newScale = scale;

	if (delta === undefined) {
		newScale = 1;
	} else if (delta) {
		if (scale === 2) {
			return;
		}

		if (scale >= 1) {
			newScale = scale + 0.5;
		} else {
			newScale = scale * 2;
		}
	} else {
		if (scale === 0.25) {
			return;
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
const setExportTo = (payload: string) => ({
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
 * Установка кода для вызова формы редактирования
 * @param {string} editFormCode - код
 */
const setEditForm = (editFormCode: string) => ({
	editFormCode,
	type: VERIFY_EVENTS.SET_EDIT_FORM
});

export {
	setActiveElement,
	setScale,
	setExportTo,
	showEditForm,
	setPosition,
	getDataEntity
};
