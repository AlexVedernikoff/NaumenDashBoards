// @flow
import cn from 'classnames';
import Icon from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS} from './constants';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		active: false,
		className: '',
		disable: false,
		round: true,
		tip: '',
		variant: VARIANTS.INFO
	};

	handleClick = event => {
		const {disable, onClick} = this.props;

		if (!disable && onClick) {
			onClick(event);
		}
	};

	render () {
		const {active, className, disable, icon, round, tip, variant} = this.props;
		const {GRAY, INFO} = VARIANTS;
		const buttonCN = cn({
			[styles.button]: true,
			[styles.round]: round,
			[styles.disable]: disable,
			[styles.active]: active && !disable,
			[className]: true,
			[styles.info]: variant === INFO,
			[styles.gray]: variant === GRAY
		});

		return (
			<button
				className={buttonCN}
				onClick={this.handleClick}
				title={tip}
				type="button"
			>
				<Icon name={icon} />
			</button>
		);
	}
}

export default IconButton;
