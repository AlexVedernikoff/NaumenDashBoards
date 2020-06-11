// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Text} from 'components/atoms';

export class FormCheckControl extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		reverse: false
	};

	render () {
		const {children, className, label, reverse} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.reverseContainer]: reverse,
			[className]: true
		});

		return (
			<div className={containerCN}>
				{children}
				<Text className={styles.label}>{label}</Text>
			</div>
		);
	}
}

export default FormCheckControl;
