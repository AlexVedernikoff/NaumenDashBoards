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

	renderLabel = () => {
		const {label, onClickLabel} = this.props;
		return <Text className={styles.label} onClick={onClickLabel}>{label}</Text>;
	};

	render () {
		const {children, className, reverse} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.reverseContainer]: reverse,
			[className]: true
		});

		return (
			<div className={containerCN}>
				{children}
				{this.renderLabel()}
			</div>
		);
	}
}

export default FormCheckControl;
