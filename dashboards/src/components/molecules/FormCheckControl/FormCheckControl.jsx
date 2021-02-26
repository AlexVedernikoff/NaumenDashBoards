// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import Text from 'components/atoms/Text';

export class FormCheckControl extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		reverse: false,
		tip: ''
	};

	renderLabel = () => {
		const {label, onClickLabel} = this.props;

		return <Text className={styles.label} onClick={onClickLabel}>{label}</Text>;
	};

	render () {
		const {children, className, disabled, reverse, tip} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.reverseContainer]: reverse,
			[styles.disabled]: disabled,
			[className]: true
		});

		return (
			<div className={containerCN} title={tip}>
				{children}
				{this.renderLabel()}
			</div>
		);
	}
}

export default FormCheckControl;
