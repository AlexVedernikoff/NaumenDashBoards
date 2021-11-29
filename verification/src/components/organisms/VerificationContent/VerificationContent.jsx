// @flow
import FinishedVerificationContent from './FinishedVerificationContent';
import InVerificationContent from './InVerificationContent';
import NoVerificationContent from './NoVerificationContent';
import type {Props} from 'containers/VerificationContent/types';
import React, {PureComponent} from 'react';
import {SettingVerificationState} from 'store/setting/types';

export class VerificationContent extends PureComponent<Props> {
	render () {
		const {setting} = this.props;

		if (setting.userIsAbleToVerify) {
			switch (setting.verificationState) {
				case SettingVerificationState.IN_VERIFICATION:
				case SettingVerificationState.VERIFICATION_PROGRESS:
					return <InVerificationContent {...this.props} />;
				case SettingVerificationState.NO_VERIFICATION:
					return <NoVerificationContent {...this.props} />;
				case SettingVerificationState.VERIFICATION_FINISHED:
					return <FinishedVerificationContent {...this.props} />;
			}
		}

		return null;
	}
}

export default VerificationContent;
