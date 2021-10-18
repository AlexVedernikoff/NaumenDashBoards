// @flow
import {SETTING_EVENTS} from './constants';

export type SettingVerification = {
	title: string,
	value: string
};

export type SettingVerificationState = {
	IN_VERIFICATION: 'IN_VERIFICATION',
	NO_VERIFICATION: 'NO_VERIFICATION',
	VERIFICATION_FINISHED: 'VERIFICATION_FINISHED',
};

export type SettingData = {
	message: string,
	userIsAbleToVerify: boolean,
	verification: SettingVerification[],
	verificationState: $Keys<SettingVerificationState>,
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
