// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getDashboardDescription} from 'store/dashboard/settings/selectors';
import type {ResultWithMessage, SourceFiltersItem, UpdateSourcesFilterResult} from './types';
import {SOURCES_FILTERS_EVENTS} from './constants';

/**
 * Старт загрузки данных
 * @returns {object} Action cтарта загрузки данных
 *
 */
const requestSourceFilters = () => ({type: SOURCES_FILTERS_EVENTS.REQUEST_SOURCE_FILTERS});

/**
 * Окончание загрузки данных
 * @returns {object} Action окончания загрузки данных
 *
 */
const receiveSourceFilters = () => ({type: SOURCES_FILTERS_EVENTS.RECEIVE_SOURCE_FILTERS});

/**
 * Ошибка загрузки данных
 * @returns {object} Action ошибки загрузки данных
 *
 */
const requestSourceFiltersError = () => ({type: SOURCES_FILTERS_EVENTS.REQUEST_SOURCE_FILTERS_ERROR});

/**
 * Очистка статусов загрузки данных
 * @returns {object} Action ошибки загрузки данных
 *
 */
const clearRequestSourceFiltersStatus = () => ({type: SOURCES_FILTERS_EVENTS.CLEAR_REQUEST_SOURCE_FILTERS_STATUS});

/**
 * Загрузка предустановленных фильтров для указанного источника
 *
 * @param {string} metaClass  - идентификатор источника
 * @returns {ThunkAction}
 */
const fetchSourcesFilters = (metaClass: string): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		try {
			dispatch(requestSourceFilters());

			const filters = await window.jsApi.restCallModule('dashboardSettings', 'getSourceFilters', metaClass);

			dispatch({
				payload: {filters, source: metaClass},
				type: SOURCES_FILTERS_EVENTS.UPDATE_SOURCE_FILTERS
			});

			dispatch(receiveSourceFilters());
		} catch {
			dispatch(requestSourceFiltersError());
		}
	};

/**
 * Обновляет список предустановленных фильтров для указаного источника
 *
 * @param {string} source - идентификатор источника
 * @param {object} sourceFilter - список новых фильтров
 * @returns {ThunkAction}
 */
const updateSourcesFilter = (source: string, sourceFilter: SourceFiltersItem): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<UpdateSourcesFilterResult> => {
		const {descriptor, id, label} = sourceFilter;
		const store = getState();
		const dashboard = getDashboardDescription(store);

		try {
			const {result} = await window.jsApi.restCallModule('dashboardSettings', 'saveSourceFilters', {
				dashboard,
				sourceFilter: {
					descriptor,
					id,
					label,
					value: source
				}
			});

			dispatch(fetchSourcesFilters(source));

			return {filterId: result, result: true};
		} catch (exception) {
			dispatch(requestSourceFiltersError());

			const {responseText, status} = exception;

			if (status === 500) {
				// TODO: SMRMEXT-12163
				if (/Название фильтра должно быть уникально/.test(responseText)) {
					return {message: `Фильтр с названием ${label} не может быть сохранен. Название фильтра должно быть уникально.`, result: false};
				} else if (/Фильтр с текущими параметрами уже существует/.test(responseText)) {
					return {message: `Фильтр с текущими параметрами уже существует.`, result: false};
				}
			}

			return {message: 'Ошибка сохранения фильтра', result: false};
		}
	};

/**
 * Удаляет указаный фильтр
 *
 * @param {string} source - идентификатор источника
 * @param {string} filterId - ключ фильтра
 * @returns {ThunkAction}
 */
const deleteSourcesFilter = (source: string, filterId: string): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<ResultWithMessage> => {
		try {
			dispatch(requestSourceFilters());

			const {result} = await window.jsApi.restCallModule('dashboardSettings', 'deleteSourceFilters', filterId);

			if (result) {
				dispatch(fetchSourcesFilters(source));
				return {result: true};
			} else {
				dispatch(receiveSourceFilters());
			}
		} catch (exception) {
			dispatch(requestSourceFiltersError());
			const {status} = exception;

			// TODO: SMRMEXT-12163
			if (status === 500) {
				return {message: 'Серверная ошибка удаления фильтра', result: false};
			}
		}
		return {message: 'Ошибка удаления фильтра', result: false};
	};

/**
 * Проверка возможности применить данный фильтр на данном дашборде
 *
 * @param {string} source - идентификатор источника
 * @param {string} sourceFilter - ключ фильтра
 * @returns {ThunkAction}
 */
const checkApplyFilter = (source: string, sourceFilter: SourceFiltersItem): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<ResultWithMessage> => {
		const store = getState();
		const {code: dashboardKey} = store.dashboard.settings;

		try {
			const {result} = await window.jsApi.restCallModule('dashboardSettings', 'filterIsBadToApply', { dashboardKey, sourceFilter });

			if (!result) {
				return {result: true};
			}

			return {message: 'Ошибка применения фильтра', result: false};
		} catch (ex) {
			return {message: 'Ошибка применения фильтра', result: false};
		}
	};

export {
	clearRequestSourceFiltersStatus,
	checkApplyFilter,
	deleteSourcesFilter,
	fetchSourcesFilters,
	updateSourcesFilter,
	requestSourceFilters,
	receiveSourceFilters,
	requestSourceFiltersError
};
