// @flow
import cn from 'classnames';
import {DEFAULT_PROPS} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import Text from 'components/Text';
import {TEXT_TYPES} from 'components/Text/constants';

export class FormControl extends PureComponent<Props> {
	static defaultProps = DEFAULT_PROPS;

	renderLabel = () => {
		const {isTitle, label, onClickLabel, small} = this.props;
		const type = isTitle ? TEXT_TYPES.TITLE : (small ? TEXT_TYPES.SMALL : TEXT_TYPES.REGULAR);

		return <Text className={styles.label} onClick={onClickLabel} type={type}>{label}</Text>;
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

export default FormControl;
