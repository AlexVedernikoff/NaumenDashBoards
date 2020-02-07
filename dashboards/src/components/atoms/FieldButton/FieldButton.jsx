// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Tip} from 'components/atoms';

export class FieldButton extends PureComponent<Props> {
	render () {
		const {children, onClick, tip} = this.props;

		return (
			<Tip text={tip}>
				<div className={styles.button} onClick={onClick}>
					{children}
				</div>
			</Tip>
		);
	}
}

export default FieldButton;
