// @flow

import type {Props} from 'containers/VerificationContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class NoVerificationContent extends PureComponent<Props> {
	render () {
		const {setting} = this.props;

		return (
			<div className={styles.content}>
				{setting.message}
			</div>
		);
	}
}

export default NoVerificationContent;
