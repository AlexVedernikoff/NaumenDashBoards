// @flow
import type {Dispatch, ThunkAction} from 'store/types';
import {api, getContext, getSignature, getInitialParams} from 'utils/api';
import type {GetState} from 'store/types';
import {SIGNATURE_EVENTS, SIGNATURE_STATE} from './constants';
import type {Params} from './types';

/**
 * Получает данные, необходимые для работы ВП
 * @returns {ThunkAction}
 */
const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const context = getContext();
		const params = await getInitialParams();

		dispatch(showLoader());
		dispatch(setContext(context));
		dispatch(setParams(params));
		await dispatch(fetchSignature());
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(hideLoader());
	}
};

/**
 * Проверяет наличие подписи в карточке
 * @returns {ThunkAction}
 */
const fetchSignature = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		dispatch(showLoader());

		const {subjectUuid, params} = getState().signature;
		const {signatureAttributeCode} = params;
		const data = await getSignature(subjectUuid, signatureAttributeCode);

		dispatch(getInitialState(data));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(hideLoader());
	}
};

/**
 * Получает первоначальное состояние ВП
 * @param {null | Array<Object>} data - ответ на запрос о наличии подписи
 * @returns {ThunkAction}
 */
const getInitialState = (data: null | Array<Object>): ThunkAction => (dispatch: Dispatch) => {
		if (!data) {
			dispatch(setError("Атрибут для подписи настроен неправильно или у вас нет прав на его просмотр"));
		} else if (data.length) {
			dispatch(setNewState(SIGNATURE_STATE.FINAL_STATE));
		} else {
			dispatch(setNewState(SIGNATURE_STATE.START_STATE));
		}
};

/**
 * Отправляет подпись
 * @param {string} dataUrl подписи
 * @returns {ThunkAction}
 */
const sendSignature = (dataUrl: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {subjectUuid, params} = getState().signature;
		const {signatureAttributeCode} = params;

		dispatch(showLoader());
		await api.postSignature(dataUrl, signatureAttributeCode, subjectUuid);
		dispatch(setNewState(SIGNATURE_STATE.FINAL_STATE));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(hideLoader());
	}
};

const addSignature = (payload: Array<Array<number>>) => ({
	type: SIGNATURE_EVENTS.ADD_SIGNATURE,
	payload
});

const hideLoader = () => ({
	type: SIGNATURE_EVENTS.HIDE_LOADER,
});

const showLoader = () => ({
	type: SIGNATURE_EVENTS.SHOW_LOADER,
});

const setContext = (payload: string) => ({
	type: SIGNATURE_EVENTS.SET_CONTEXT,
	payload
});

const setError = (payload: string) => ({
	type: SIGNATURE_EVENTS.SET_ERROR,
	payload
});

const setNewState = (payload: string) => ({
	type: SIGNATURE_EVENTS.SET_STATE,
	payload
});

const setParams = (payload: Params) => ({
	type: SIGNATURE_EVENTS.SET_PARAMS,
	payload
});

export {
	addSignature,
	hideLoader,
	showLoader,
	getAppConfig,
	sendSignature,
	setNewState
};
