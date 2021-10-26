// @flow
import {SETTING_EVENTS} from './constants';

export type SettingVerification = {
	title: string,
	values: string[]
};

export const SettingVerificationState = {
	IN_VERIFICATION: 'IN_VERIFICATION',
	NO_VERIFICATION: 'NO_VERIFICATION',
	VERIFICATION_FINISHED: 'VERIFICATION_FINISHED'
};

export type SettingVerificationStateKeys = $Keys<SettingVerificationState>;

export type SettingData = {
	message: string,
	userIsAbleToVerify: boolean,
	verification: SettingVerification[],
	verificationState: SettingVerificationStateKeys,
};

export type SettingAction = {
	payload: null,
	type: typeof SETTING_EVENTS.EMPTY_DATA,
};

export type SettingState = {
	error: boolean,
	loading: boolean,
	setting: SettingData,
};
