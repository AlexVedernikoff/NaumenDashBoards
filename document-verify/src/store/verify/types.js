// @flow
import {VERIFY_EVENTS} from './constants';

export type VerifyEntities = {
	equal: string,
	idInText: string,
	state: string
};

export type VerifyData = {
	document: string,
	entities: VerifyEntities[],
	html: string,
	object: string,
	message: string,
	uuidDocument: string,
};

export type VerifyAction = {
	payload: null,
	type: typeof VERIFY_EVENTS.EMPTY_DATA,
};

export type VerifyState = {
	data: VerifyData,
	error: boolean,
	loading: boolean,
	notification: boolean,
	uuidDocument: string,
};
