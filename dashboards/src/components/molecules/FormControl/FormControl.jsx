// @flow
import cn from 'classnames';
import {Label} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormControl extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		label: '',
		row: false
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

	renderLabel = () => {
		const {label} = this.props;
		return label ? <Label className={styles.label}>{label}</Label> : null;
	};

	render () {
		const {className} = this.props;

		return (
			<div className={className}>
				{this.renderLabel()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default FormControl;
