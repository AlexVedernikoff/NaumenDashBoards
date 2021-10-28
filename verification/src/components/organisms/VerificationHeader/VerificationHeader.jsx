// @flow
import React, {PureComponent} from 'react';
import {SettingVerificationState, SettingVerificationStateKeys} from 'store/setting/types';
import styles from './styles.less';

export class VerificationHeader extends PureComponent<Props> {
	render () {
		const {attributes, setting, verification} = this.props;
		const attribute = attributes[verification.index];

		const renderTitleVerification = (obj: SettingVerificationStateKeys) => {
			switch (obj) {
				case SettingVerificationState.IN_VERIFICATION:
					return attribute?.title;
				case SettingVerificationState.NO_VERIFICATION:
					return 'Проведение проверок обращения';
				case SettingVerificationState.VERIFICATION_FINISHED:
					return 'Проверки обращения проведены';
			}
		};

		return (
			<p className={styles.header}>
				{renderTitleVerification(setting.verificationState)}
			</p>
		);
	}
}

export default VerificationHeader;
