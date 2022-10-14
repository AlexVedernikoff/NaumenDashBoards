// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {VARIANTS} from './constants';

export class Button extends Component<Props> {
	static defaultProps = {
		block: false,
		className: '',
		disabled: false,
		outline: false,
		type: 'button',
		variant: VARIANTS.INFO
	};

	getClassNames = () => {
		const {block, className, outline, variant} = this.props;
		const {ADDITIONAL, GRAY, GREEN, INFO, SIMPLE} = VARIANTS;

		return cn({
			[styles.button]: true,
			[styles.block]: block,
			[styles.gray]: variant === GRAY && !outline,
			[styles.info]: variant === INFO && !outline,
			[styles.outlineInfo]: variant === INFO && outline,
			[styles.green]: variant === GREEN && !outline,
			[styles.outlineGreen]: variant === GREEN && outline,
			[styles.simple]: variant === SIMPLE,
			[styles.additional]: variant === ADDITIONAL
		}, className);
	};

	render () {
		const {children, disabled, onClick, tooltip, type} = this.props;

		const className = this.getClassNames();
		const props = {
			children,
			className,
			disabled,
			onClick,
			title: tooltip,
			type
		};

		return (
			<button {...props}>
				{children}
			</button>
		);
	}
}

export default Button;
