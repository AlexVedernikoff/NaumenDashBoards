// @flow
import {VERIFY_EVENTS} from './constants';

export type VerifyEntities = {
	equal: string,
	idInText: string,
	state: string
};

export type VerifyData = {
	entities: VerifyEntities[],
	html: string,
	message: string,
};

export type VerifyAction = {
	payload: null,
	type: typeof VERIFY_EVENTS.EMPTY_DATA,
};

export type VerifyState = {
	data: VerifyData,
	error: boolean,
	loading: boolean,
};
