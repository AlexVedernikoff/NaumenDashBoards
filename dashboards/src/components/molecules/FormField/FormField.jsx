// @flow
import cn from 'classnames';
import {FieldError} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormField extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		error: '',
		forwardedRef: null,
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
	};

	renderError = () => {
		const {error} = this.props;
		return error ? <FieldError text={error} /> : null;
	};

	renderLabel = () => {
		const {label} = this.props;
		return label ? <div className={styles.label}>{label}</div> : null;
	};

	render () {
		const {className, forwardedRef, small} = this.props;
		const containerCN = cn({
			[styles.field]: true,
			[styles.small]: small,
			[className]: true
		});

		return (
			<div className={containerCN} ref={forwardedRef}>
				{this.renderLabel()}
				{this.renderChildren()}
				{this.renderError()}
			</div>
		);
	}
}

export default FormField;
