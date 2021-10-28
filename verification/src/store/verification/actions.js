// @flow
import {AttributesValue} from 'store/attributes/types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getSubjectUuid, setValueAndTaskState} from 'utils/api';
import {VERIFICATION_EVENTS} from './constants';

/**
 * Установка индекса проверки атрибута
 * @returns {ThunkAction}
 * @param {number} index - индекс шага
 */
const setIndexVerification = (index: number): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch({
		payload: index,
		type: VERIFICATION_EVENTS.SET_STEP_VERIFICATION
	});
};

/**
 * Сохранение текущего кода атрибута для последующей проверки
 * @returns {ThunkAction}
 * @param {AttributesData} code - код
 */
const setVerificationCode = (code: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		payload: code,
		type: VERIFICATION_EVENTS.SET_VERIFICATION_CODE
	});
};

/**
 * Сохранение значений для последующей проверки
 * @returns {ThunkAction}
 * @param {AttributesData} values - атрибут
 */
const setVerificationValue = (values: AttributesValue): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		payload: values,
		type: VERIFICATION_EVENTS.SET_VERIFICATION_VALUE
	});
};

/**
 * Отправка значений для проверки и получение результата
 * @returns {ThunkAction}
 */
const sendVerificationValue = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {verification: {code, values}} = getState();
	const claimUUID = await getSubjectUuid();

	try {
		dispatch(showLoaderVerification());

		const {isFullChecked, message} = await setValueAndTaskState(claimUUID, code, values);

		dispatch({
			payload: {isFullChecked, message},
			type: VERIFICATION_EVENTS.SET_VERIFICATION_RESULT
		});
	} catch (error) {
		dispatch(setErrorVerification(error));
	} finally {
		dispatch(hideLoaderVerification());
	}
};

/**
 * Показывает индикатор загрузки данных
 */
const showLoaderVerification = () => ({
	type: VERIFICATION_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки
 */
const hideLoaderVerification = () => ({
	type: VERIFICATION_EVENTS.HIDE_LOADER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorVerification = (payload: string) => ({
	payload,
	type: VERIFICATION_EVENTS.SET_ERROR_DATA
});

export {
	setIndexVerification,
	setVerificationCode,
	setVerificationValue,
	sendVerificationValue
};
