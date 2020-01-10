// @flow
import {PlusIcon} from 'icons/form';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CreationPanel extends PureComponent<Props> {
	render () {
		const {onClick, text} = this.props;

		return (
			<div className={styles.container}>
				<div className={styles.button} onClick={onClick}>
					<PlusIcon />
					<div className={styles.text}>{text}</div>
				</div>
			</div>
		);
	}
}

export default CreationPanel;
