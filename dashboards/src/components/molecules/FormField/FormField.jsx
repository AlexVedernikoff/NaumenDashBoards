// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormField extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		label: '',
		row: false,
		small: false
	};

	renderChildren = () => {
		const {children, row} = this.props;
		const childrenCN = cn({
			[styles.row]: row
		});

		return (
			<div className={childrenCN}>
				{children}
			</div>
		);
	}

	renderLabel = () => {
		const {label} = this.props;
		return label ? <div className={styles.label}>{label}</div> : null;
	}

	render () {
		const {className, small} = this.props;
		const containerCN = cn({
			[styles.field]: true,
			[styles.small]: small,
			[className]: true
		});

		return (
			<div className={containerCN}>
				{this.renderLabel()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default FormField;
