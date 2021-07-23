// @flow
import type {AppState} from 'store/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ConnectedProps} from './types';
import {getCustomGroupsValues} from 'store/customGroups/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {date, dateTime} = ATTRIBUTE_TYPES;
	const customGroups = getCustomGroupsValues(state).filter(({type}) => type === date || type === dateTime);

	return {
		customGroups
	};
};
