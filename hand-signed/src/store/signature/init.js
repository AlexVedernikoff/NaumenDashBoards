// @flow
import {SIGNATURE_EVENTS, SIGNATURE_STATE} from './constants';
import type {SignatureAction, SignatureState} from './types';

export const initialSignatureState: SignatureState = {
	subjectUuid: '',
	data: [],
	error: '',
	loading: true,
	params: {
		drawingStartButtonName: 'Добавить подпись',
		signatureAttributeCode: 'signature'
	},
	state: SIGNATURE_STATE.START_STATE
};

export const defaultSignatureAction: SignatureAction = {
	type: SIGNATURE_EVENTS.UNKNOWN_SIGNATURE_ACTION,
	payload: null
};
