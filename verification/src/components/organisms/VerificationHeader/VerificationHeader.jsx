// @flow
import React from 'react';
import {SettingVerificationState} from 'store/setting/types';
import styles from './styles.less';

const VerificationHeader = ({attributes, setting, verification}: Props) => {
	const attribute = attributes[verification.index];
	const obj = verification?.isFullChecked ? SettingVerificationState.NO_VERIFICATION : setting.verificationState;

	let content = '';

	switch (obj) {
		case SettingVerificationState.IN_VERIFICATION:
			content = attribute?.title;
			break;
		case SettingVerificationState.NO_VERIFICATION:
			content = 'Проведение проверок обращения';
			break;
		case SettingVerificationState.VERIFICATION_FINISHED:
			content = 'Проверки обращения проведены';
			break;
	}

	return content ? <p className={styles.header}>{content}</p> : null;
};

export default VerificationHeader;
