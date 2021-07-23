// @flow
import type {AppState} from 'store/types';
import {ATTRIBUTE_TYPES} from 'src/store/sources/attributes/constants';
import type {ConnectedProps, Props} from './types';
import {getCustomGroupsValues} from 'store/customGroups/selectors';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {localizedText, string} = ATTRIBUTE_TYPES;
	const customGroups = getCustomGroupsValues(state).filter(({type}) => type === string || type === localizedText);

	return {
		customGroups
	};
};
