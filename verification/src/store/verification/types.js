// @flow
import {AttributesData} from 'store/attributes/types';
import {VERIFICATION_EVENTS} from './constants';

export type VerificationAction = {
	payload: null,
	type: typeof VERIFICATION_EVENTS.EMPTY_DATA,
};

export type VerificationState = {
	attribute: AttributesData,
	error: boolean,
	index: number,
	isFullChecked: boolean,
	loading: boolean,
	message: string,
};
