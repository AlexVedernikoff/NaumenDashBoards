// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps, Props} from './types';
import {getCustomGroupsValues} from 'store/customGroups/selectors';
import {TIMER_VALUE} from 'store/sources/attributes/constants';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const customGroups = getCustomGroupsValues(state).filter(
		({timerValue, type}) => (type === props.attribute.type && timerValue === TIMER_VALUE.VALUE)
	);

	return {
		customGroups
	};
};
