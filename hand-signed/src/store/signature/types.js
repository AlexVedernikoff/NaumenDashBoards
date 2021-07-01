// @flow
import {SIGNATURE_EVENTS, SIGNATURE_STATE} from './constants';

type AddSignature = {
	type: typeof SIGNATURE_EVENTS.ADD_SIGNATURE,
	payload: Array<Array<number>>
};

export type Params = {
	drawingStartButtonName: string,
	signatureAttributeCode: string
};

type ShowLoader = {
	type: typeof SIGNATURE_EVENTS.SHOW_LOADER,
};

type HideLoader = {
	type: typeof SIGNATURE_EVENTS.HIDE_LOADER,
};

type SetError = {
	type: typeof SIGNATURE_EVENTS.SET_ERROR,
	payload: string
};

type SetNewState = {
	type: typeof SIGNATURE_EVENTS.SET_STATE,
	payload: typeof SIGNATURE_STATE
};

type SetParams = {
	type: typeof SIGNATURE_EVENTS.SET_PARAMS,
	payload: Params
};

type UnknownGeolocationAction = {
	type: typeof SIGNATURE_EVENTS.UNKNOWN_SIGNATURE_ACTION,
	payload: null
};

export type SignatureAction =
	| AddSignature
	| ShowLoader
	| HideLoader
	| SetParams
	| SetError
	| SetNewState
	| UnknownGeolocationAction
;

export type SignatureState = {
	subjectUuid: string,
	error: boolean,
	loading: boolean,
	params: Params,
	data: Array<Array<number>>,
	state: string,
	success: boolean
};
