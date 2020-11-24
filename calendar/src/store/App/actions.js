// @flow
import type {Dispatch, ThunkAction} from 'store/types';
import {APP_EVENTS} from './constants';
import type {InitParams} from './types';
import type {ObjectType} from 'utils/types';

/**
 * Возвращает контекст запуска приложения
 * @returns {ThunkAction}
 */
const getInitParams = (): ThunkAction => async (dispatch: Dispatch) => {
	try {
		dispatch(setAppLoading(true));
		const {DefaultMode: defaultView = '{week=Неделя}'}: ObjectType = await window.jsApi.contents.getParameters();

		if (window.jsApi.forms) {
			const data: ObjectType = await window.jsApi.forms.getValues();
			const subjectId: string = window.jsApi.extractSubjectUuid();
			const {metaClass} = data;

			dispatch(setAppInitData({
				defaultView,
				metaClass,
				subjectId
			}));

			return;
		}

		dispatch(setAppInitData({
			defaultView,
			metaClass: null,
			subjectId: null
		}));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(setAppLoading(false));
	}
};

const setAppInitData = (payload: InitParams) => ({
	payload,
	type: APP_EVENTS.SET_APP_INIT_DATA
});

const setAppLoading = (payload: boolean) => ({
	payload,
	type: APP_EVENTS.SET_APP_LOADING
});

const setError = (payload: Error) => ({
	payload,
	type: APP_EVENTS.SET_ERROR
});

export {
	getInitParams,
	setAppLoading,
	setError
};
