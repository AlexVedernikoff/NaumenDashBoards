// @flow
import cn from 'classnames';
import {PLACEMENTS} from 'components/atoms/Tooltip/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SimpleTooltip} from 'components/atoms';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		tip: ''
	};

	renderButton = () => {
		const {children, className, onClick} = this.props;

		return (
			<button className={cn(styles.button, className)} onClick={onClick}>
				{children}
			</button>
		);
	};

	renderButtonWithTip = () => {
		const {tip} = this.props;

		return (
			<SimpleTooltip placement={PLACEMENTS.BOTTOM} text={tip}>
				{this.renderButton()}
			</SimpleTooltip>
		);
	};

	render () {
		return this.props.tip ? this.renderButtonWithTip() : this.renderButton();
	}
}

export default IconButton;
