// @flow
import type {AppState} from 'store/types';

/**
 * Формирует параметры для запросов изменения данных дашборда
 * @param {AppState} state - состояние приложения
 * @returns {void}
 */
const getParams = (state: AppState) => {
	const {context, dashboard} = state;
	const {contentCode, subjectUuid: classFqn} = context;
	const {editable, personal: isPersonal} = dashboard;

	return {
		classFqn,
		contentCode,
		editable,
		isPersonal
	};
};

export {
	getParams
};
