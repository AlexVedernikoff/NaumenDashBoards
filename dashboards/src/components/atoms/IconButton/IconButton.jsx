// @flow
import cn from 'classnames';
import {Icon} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS} from './constants';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		active: false,
		className: '',
		round: true,
		tip: '',
		variant: VARIANTS.INFO
	};

	render () {
		const {active, className, icon, onClick, round, tip, variant} = this.props;
		const {GRAY, INFO} = VARIANTS;
		const buttonCN = cn({
			[styles.button]: true,
			[styles.round]: round,
			[styles.active]: active,
			[className]: true,
			[styles.info]: variant === INFO,
			[styles.gray]: variant === GRAY
		});

		return (
			<button
				className={buttonCN}
				onClick={onClick}
				title={tip}
				type="button"
			>
				<Icon name={icon} />
			</button>
		);
	}
}

export default IconButton;
