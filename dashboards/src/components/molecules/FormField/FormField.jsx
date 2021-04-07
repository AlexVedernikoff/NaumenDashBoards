// @flow
import cn from 'classnames';
import FieldError from 'components/atoms/FieldError';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
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

	renderError = () => {
		const {error} = this.props;

		return error ? <FieldError text={error} /> : null;
	};

	renderField = () => {
		const {children, className, forwardedRef, row, small} = this.props;
		const containerCN = cn({
			[styles.field]: true,
			[styles.small]: small,
			[styles.row]: row,
			[className]: true
		});

		return (
			<div className={containerCN} ref={forwardedRef}>
				{children}
				{this.renderError()}
			</div>
		);
	};

	renderLabel = () => {
		const {label} = this.props;

		return label ? <Label className={styles.label}>{label}</Label> : null;
	};

	render () {
		return (
			<Fragment>
				{this.renderLabel()}
				{this.renderField()}
			</Fragment>
		);
	}
}

export default FormField;
