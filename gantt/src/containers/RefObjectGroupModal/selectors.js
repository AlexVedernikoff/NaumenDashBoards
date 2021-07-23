// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps, Props} from './types';
import {getCustomGroupsValues} from 'store/customGroups/selectors';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const customGroups = getCustomGroupsValues(state).filter(({type}) => type === props.customType);

	return {
		customGroups
	};
};
