// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormCheckControl extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		reverse: false
	}

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
				<span className={styles.label}>{label}</span>
			</div>
		);
	}
}

export default FormCheckControl;
