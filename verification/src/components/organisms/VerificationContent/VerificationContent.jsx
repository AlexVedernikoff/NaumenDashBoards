// @flow
import type {Props} from 'containers/VerificationContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class VerificationContent extends PureComponent<Props> {
	render () {
		const {attributes, setting} = this.props;

		const renderPreformattedObject = obj => {
			return <pre>{JSON.stringify(obj, null, 2)}</pre>;
		};

		return (
			<div className={styles.content}>
				{renderPreformattedObject(setting)}
				{renderPreformattedObject(attributes)}
			</div>
		);
	}
}

export default VerificationContent;
