// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchGroupsAttributes} from 'store/sources/attributesData/groupsAttributes/actions';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';

/**
 * Формирует свойства для withFilterForm из redux
 * @param {AppState} state - Стейт redux
 * @param {object} ownProps - свойства верхнего объекта
 * @returns {ConnectedProps<object>} - дополнительные свойства
 */
export const props = function <Config: {}> (state: AppState, ownProps: Config): ConnectedProps<Config> {
	return {
		attributes: state.sources.attributes,
		isUserMode: isUserModeDashboard(state),
		parentProps: ownProps,
		sources: state.sources.data.map,
		sourcesFilters: state.sources.sourcesFilters.map
	};
};

export const functions = {
	fetchAttributes,
	fetchGroupsAttributes
};
