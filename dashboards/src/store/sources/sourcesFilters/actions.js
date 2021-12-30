// @flow
import api from 'api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {FilterAlreadyExists, FilterNameNotUnique, RemoveFilterFailed} from 'api/errors';
import {getDashboardDescription} from 'store/dashboard/settings/selectors';
import type {ResultWithMessage, SourceFiltersItem, UpdateSourcesFilterResult} from './types';
import {SOURCES_FILTERS_EVENTS} from './constants';

/**
 * Старт загрузки данных
 * @returns {object} Action старта загрузки данных
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

			const filters = await api.instance.dashboardSettings.sourceFilters.getAll(metaClass);

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
 * Обновляет список предустановленных фильтров для указанного источника
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
			const sourceFilter = {
				descriptor,
				id,
				label,
				value: source
			};
			const {result} = await api.instance.dashboardSettings.sourceFilters.save(dashboard, sourceFilter);

			dispatch(fetchSourcesFilters(source));

			return {filterId: result, result: true};
		} catch (exception) {
			dispatch(requestSourceFiltersError());

			if (exception instanceof FilterAlreadyExists || exception instanceof FilterNameNotUnique) {
				return {message: exception.message, result: false};
			}

			return {message: 'Ошибка сохранения фильтра', result: false};
		}
	};

/**
 * Удаляет указанный фильтр
 * @param {string} source - идентификатор источника
 * @param {string} filterId - ключ фильтра
 * @returns {ThunkAction}
 */
const deleteSourcesFilter = (source: string, filterId: string): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<ResultWithMessage> => {
		try {
			dispatch(requestSourceFilters());

			const {result} = await api.instance.dashboardSettings.sourceFilters.delete(filterId);

			if (result) {
				dispatch(fetchSourcesFilters(source));
				return {result: true};
			} else {
				dispatch(receiveSourceFilters());
			}
		} catch (exception) {
			dispatch(requestSourceFiltersError());

			if (exception instanceof RemoveFilterFailed) {
				return {message: exception.message, result: false};
			}
		}
		return {message: 'Ошибка удаления фильтра', result: false};
	};

/**
 * Проверка возможности применить данный фильтр на данном дашборде
 * @param {string} source - идентификатор источника
 * @param {string} sourceFilter - ключ фильтра
 * @returns {ThunkAction}
 */
const checkApplyFilter = (source: string, sourceFilter: SourceFiltersItem): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<ResultWithMessage> => {
		const store = getState();
		const {code: dashboardKey} = store.dashboard.settings;

		try {
			const {correctFilter, result} = await api.instance.dashboardSettings.sourceFilters.check(dashboardKey, sourceFilter);

			if (!result) {
				return {result: true};
			}

			dispatch({
				payload: {filter: correctFilter, source},
				type: SOURCES_FILTERS_EVENTS.UPDATE_SOURCE_FILTER
			});

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
