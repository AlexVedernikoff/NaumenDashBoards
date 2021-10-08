// @flow
import type {Props} from 'containers/VerificationContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class VerificationContent extends PureComponent<Props> {
	render () {
		return (
			<div className={styles.content}>
				Content
			</div>
		);
	}
}

export default VerificationContent;
