// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FieldLabel extends PureComponent<Props> {
	render () {
		const {text} = this.props;
		return <div className={styles.label}>{text}</div>;
	}
}

export default FieldLabel;
