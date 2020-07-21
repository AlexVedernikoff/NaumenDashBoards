// @flow
import cn from 'classnames';
import {Icon} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		active: false,
		className: '',
		round: true,
		tip: ''
	};

	render () {
		const {active, className, icon, onClick, round, tip} = this.props;
		const buttonCN = cn({
			[styles.button]: true,
			[styles.round]: round,
			[styles.active]: active,
			[className]: true
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
